
export function isOnlyEmoji(text: string) {
  if (!text) return false;

  const trimmed = text.trim();

  const emojiRegex =
    /^(?:\p{Extended_Pictographic}|\p{Emoji_Component})+$/gu;

  const matches = trimmed.match(emojiRegex);

  return matches !== null && matches.join("") === trimmed;
}

export function getEmojiSize(text: string) {
  const emojis = [...text.matchAll(/\p{Extended_Pictographic}/gu)];
  const count = emojis.length;

  if (count === 1) return "text-4xl leading-none";
  if (count === 2) return "text-3xl leading-none";
  if (count === 3) return "text-2xl leading-none";

  return "text-3xl leading-none";
}