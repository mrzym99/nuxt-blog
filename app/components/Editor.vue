<script setup lang="ts">
import Quill from 'quill'
import type { Delta, EmitterSource, QuillOptions, Range } from 'quill'
import { onBeforeUnmount, onMounted, ref, watch } from 'vue'
import { Mention, MentionBlot } from 'quill-mention' // 插件
import 'quill/dist/quill.snow.css'
import 'quill-mention/dist/quill.mention.min.css'
import undo from '@/assets/icons/undo.svg?raw'
import redo from '@/assets/icons/redo.svg?raw'
import attachment from '@/assets/icons/attachment.svg?raw'
import type { IUser } from '~/types'
import { uploadImg } from '~/api';
import FormData from 'form-data';
import * as Emoji from 'quill2-emoji';
import 'quill2-emoji/dist/style.css';

const props = defineProps<{
  // HTML model value, supports v-model
  modelValue?: string | null
  // Quill initialization options
  options?: QuillOptions
  height?: number | string
  semantic?: boolean
  readOnly?: boolean
}>()

const emit = defineEmits<{
  (e: 'update:modelValue', value: string): void
  (e: 'textChange', { delta, oldContent, source }: { delta: Delta; oldContent: Delta; source: EmitterSource }): void
  (e: 'selectionChange', { range, oldRange, source }: { range: Range; oldRange: Range; source: EmitterSource }): void
  (e: 'editorChange', eventName: 'textChange' | 'selectionChange'): void
  (e: 'blur', quill: Quill): void
  (e: 'focus', quill: Quill): void
  (e: 'ready', quill: Quill): void
}>()

let quillInstance: Quill | null = null
const quillEditor = ref<HTMLElement>()
const model = ref<string | null>()
const userList = ref<IUser[]>([])

const editorStyle = computed(() => {
  return {
    height: typeof props.height === 'number' ? `${props.height}px` : props.height,
  }
})

const defaultOptions: QuillOptions = {
  theme: 'snow',
  placeholder: '',
  readOnly: props.readOnly,
  modules: {
    toolbar: {
      container: [
        ['undo', 'redo'],
        ['bold', 'italic', 'underline'],
        [{ background: [] }],
        [{ align: [] }],
        [{ list: 'ordered' }, { list: 'bullet' }],
        ['image', 'emoji'],
      ],
      handlers: {
        image: fileHandler('image'), // 正确放置 handlers
        attachment: fileHandler(),
        undo: () => {
          quillInstance?.history.undo()
          updateHistoryStatus()
        },
        redo: () => {
          quillInstance?.history.redo()
          updateHistoryStatus()
        },
        emoji: () => { },
      },
    },
    "emoji-toolbar": true,
    mention: {
      blotName: 'styled-mention',
      allowedChars: /^[\u4E00-\u9FA5\w]*$/, // 允许中文/英文/数字/下划线
      mentionDenotationChars: ['@'], // 触发字符
      source(searchTerm: any, renderList: any, mentionChar: any) {
        // 这里可以换成后端接口
        const users = userList.value.map((u) => {
          return {
            id: u.id,
            value: u.profile.nickName,
            avatar: u.profile.avatar,
            email: u.profile.email,
          }
        })
        const matches = users.filter(u => u.value.toLowerCase().includes(searchTerm.toLowerCase()))
        renderList(matches, searchTerm)
      },
      renderItem(item: any) {
        const container = document.createElement('div')
        container.className = 'mention-list-item'

        const avatarWrapper = document.createElement('div')
        avatarWrapper.className = 'mention-avatar'

        if (item.avatar) {
          const avatarImg = document.createElement('img')
          avatarImg.src = item.avatar
          avatarImg.alt = item.value
          avatarImg.className = 'mention-avatar-img'
          avatarWrapper.appendChild(avatarImg)
        }
        else {
          avatarWrapper.textContent = item.value.charAt(0).toUpperCase()
        }

        const text = document.createElement('div')
        text.className = 'mention-text'

        const name = document.createElement('div')
        name.className = 'mention-name'
        name.innerText = item.value

        const email = document.createElement('div')
        email.className = 'mention-email'
        email.innerText = item.email

        text.appendChild(name)
        text.appendChild(email)

        container.appendChild(avatarWrapper)
        container.appendChild(text)

        return container
      },
      onSelect(item: any, insertItem: any) {
        insertItem({ ...item, value: `${item.value} ` })
      },
    },
  },
}

watch(
  () => props.readOnly,
  (val) => {
    quillInstance?.enable(!val)
  }
)

// Convert modelValue HTML to Delta and replace editor content
const pasteHTML = (quill: Quill) => {
  model.value = props.modelValue
  const oldContent = quill.getContents()
  const delta = quill.clipboard.convert({ html: props.modelValue ?? '' })
  quill.setContents(delta)
  emit('textChange', { delta, oldContent, source: 'api' })
}

function registerMention() {
  class StyledMentionBlot extends MentionBlot {
    static override render(data: any) {
      const element = document.createElement('span')
      element.innerText = data.value
      element.setAttribute('mention-id', data.id)
      return element
    }
  }
  StyledMentionBlot.blotName = 'styled-mention'
  if (!Quill.imports['formats/styled-mention']) {
    Quill.register('formats/styled-mention', StyledMentionBlot, true)
  }

  if (!Quill.imports['modules/mention']) {
    Quill.register('modules/mention', Mention, true)
  }
}

function registerEmoji() {
  Quill.register("modules/emoji", Emoji, true);
  // Quill.register('modules/emoji-shortname', ShortNameEmoji, true)
  // Quill.register('modules/emoji-toolbar', ToolbarEmoji, true)
  // Quill.register('modules/emoji-textarea', TextAreaEmoji, true)
}

function customIcons() {
  const icons = Quill.import('ui/icons') as any
  icons.undo = undo
  icons.redo = redo
  icons.attachment = attachment
}

// Editor initialization, returns Quill instance
const initialize = async () => {
  registerMention()
  registerEmoji()
  customIcons()
  userList.value = []
  Object.assign(defaultOptions, props.options)
  const quill = new Quill(quillEditor.value as HTMLElement, defaultOptions)

  // Set editor initial model
  if (props.modelValue) {
    pasteHTML(quill)
  }

  // Handle editor selection change, emit blur and focus
  quill.on('selection-change', (range: any, oldRange: any, source: any) => {
    if (!range) {
      emit('blur', quill)
    }
    else {
      emit('focus', quill)
    }
    updateHistoryStatus()
    emit('selectionChange', { range, oldRange, source })
  })

  // Handle editor text change
  quill.on('text-change', (delta: any, oldContent: any, source: any) => {
    model.value = props.semantic ? quill.getSemanticHTML() : quill.root.innerHTML
    updateHistoryStatus()
    emit('textChange', { delta, oldContent, source })
  })

  // Handle editor change
  quill.on('editor-change', (eventName: 'textChange' | 'selectionChange') => {
    emit('editorChange', eventName)
  })

  emit('ready', quill)

  quillInstance = quill
  updateHistoryStatus()

  return quill
}

function updateHistoryStatus() {
  if (!quillInstance) {
    return
  }
  const undoBtn = document.querySelector('.ql-undo') as HTMLButtonElement
  const redoBtn = document.querySelector('.ql-redo') as HTMLButtonElement
  if (!undoBtn || !redoBtn) {
    return
  }
  undoBtn.disabled = quillInstance.history.stack.undo.length === 0
  redoBtn.disabled = quillInstance.history.stack.redo.length === 0
}

// Watch modelValue and paste HTML if has changes
watch(
  () => props.modelValue,
  (newValue) => {
    if (!quillInstance) {
      return
    }
    if (newValue && newValue !== model.value) {
      pasteHTML(quillInstance)
      // Update HTML model depending on type
      model.value = props.semantic ? quillInstance.getSemanticHTML() : quillInstance.root.innerHTML
    }
    else if (!newValue) {
      quillInstance.setContents([])
    }
  },
)

// Watch model and update modelValue if has changes
watch(model, (newValue, oldValue) => {
  if (!quillInstance) {
    return
  }
  if (newValue && newValue !== oldValue) {
    emit('update:modelValue', newValue)
  }
  else if (!newValue) {
    quillInstance.setContents([])
  }
})

function getQuillInstance() {
  return quillInstance
}

function fileHandler(type?: string) {
  return () => {
    const input = document.createElement('input')
    input.setAttribute('type', 'file')
    if (type) {
      input.setAttribute('accept', `${type}/*`)
    }
    input.click()

    input.onchange = async () => {
      const file = input.files?.[0]
      if (!file) {
        return
      }

      const formData = new FormData()
      formData.append('file', file)
      uploadImg(formData).then((res) => {
        if (quillInstance) {
          const index = quillInstance.getSelection()?.index || 0

          switch (type) {
            case 'image':
              quillInstance.insertEmbed(index, 'image', res.data)
              break
            default: {
              quillInstance.insertEmbed(index, 'link', res.data)
              break
            }
          }
        }
      })
    }
  }
}

onMounted(() => {
  initialize()
})

onBeforeUnmount(() => {
  quillInstance = null
})

// Expose init function
defineExpose<{
  getQuillInstance: () => Quill | null
}>({
  getQuillInstance,
})
</script>

<template>
  <div class="quill-container">
    <div ref="quillEditor" :style="editorStyle" />
  </div>
</template>

<style lang="scss" scoped>
.quill-container {
  width: 100%;
  height: 100%;
  line-height: normal;

  :deep(.ql-toolbar) {
    border-top-left-radius: 4px;
    border-top-right-radius: 4px;

    .ql-stroke {
      stroke: var(--text-color) !important;
    }
  }

  :deep(.ql-container) {
    font-size: 16px;
    border-bottom-left-radius: 4px;
    border-bottom-right-radius: 4px;
    font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans',
      'Helvetica Neue', sans-serif;


    img {
      max-width: 80px;
      object-fit: cover;
    }
  }

  :deep(.ql-blank::before) {
    font-style: normal;
  }

  :deep(.ql-undo[disabled]),
  :deep(.ql-redo[disabled]) {
    opacity: 0.5;
    cursor: not-allowed;

    .ql-stroke {
      stroke: var(--disabled-color) !important;
    }
  }

  :deep(.ql-mention-list) {
    padding: 4px;
  }

  :deep(.ql-mention-list-item) {
    padding: 0;
    line-height: normal;
    border-radius: 3px;
  }

  // mention style
  :deep(.mention-list-item) {
    display: flex;
    padding: 4px 8px;
    border-radius: 3px;
    align-items: center;

    .mention-avatar {
      width: 45px;
      height: 45px;
      border-radius: 50%;
      background-color: var(--disabled-color);
      color: var(--white-color);
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: 8px;
      overflow: hidden;
      flex-shrink: 0;
    }

    .mention-avatar-img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }

    .mention-text {
      flex: 1;
      display: flex;
      justify-content: flex-start;
      align-items: flex-start;
      flex-direction: column;
    }

    .mention-name {
      display: inline-block;
      font-size: 14px;
      font-weight: 400;
      line-height: 24px;
      text-transform: none;
    }

    .mention-email {
      color: var(--text-color);
      font-size: unset;
      width: 160px;
      overflow: hidden;
      text-overflow: ellipsis;
    }
  }
}
</style>