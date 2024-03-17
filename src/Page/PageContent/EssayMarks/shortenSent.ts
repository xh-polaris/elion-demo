export default function shortenSent(sent: string) {
  if (sent.length < 12) {
    return sent;
  }
  return sent.substring(0, 5) + '……' + sent.substring(sent.length - 5, sent.length);
}
