export function formatKoreanDate(
  dateString: string | null | undefined,
): string {
  if (!dateString) return "날짜 정보 없음";
  try {
    const date = new Date(dateString);
    if (isNaN(date.getTime())) return "유효하지 않은 날짜";
    return new Intl.DateTimeFormat("ko-KR", {
      year: "numeric",
      month: "long",
      day: "numeric",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    }).format(date);
  } catch {
    return "날짜 형식 오류";
  }
}
