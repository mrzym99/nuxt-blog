import { Filter } from 'bad-words';

const filter = new Filter();
export function cleanWords(text: string) {
  return filter.clean(text);
}
