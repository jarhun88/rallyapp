export default function HomeLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Let the page component handle authentication like demo page
  return <>{children}</>;
}
