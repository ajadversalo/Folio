export const metadata = {
  title: "Folio — Object-Oriented Programming",
  description: "An interactive guide to object-oriented programming principles.",
  manifest: "/manifest.webmanifest",
};

export const viewport = {
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
  themeColor: "#252a31",
};

export default function RootLayout({ children }) {
  return <html lang="en"><body>{children}</body></html>;
}
