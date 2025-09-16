import { GeistSans } from "geist/font/sans";
import { GeistMono } from "geist/font/mono";
import "./globals.css";
import Providers from "./providers";
import { auth } from "@/lib/auth"; // Import 'auth' from your lib file

export const metadata = {
  title: "SPA Tournament v4",
  description: "The ultimate pool tournament experience.",
};

// Make the component async
export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  // Fetch the session on the server using the new v5 method
  const session = await auth();

  return (
    <html
      lang="en"
      suppressHydrationWarning
      className={`${GeistSans.variable} ${GeistMono.variable}`}
    >
      <body className="bg-background text-foreground antialiased">
        {/* Pass the session as a prop to Providers */}
        <Providers session={session}>{children}</Providers>
      </body>
    </html>
  );
}
