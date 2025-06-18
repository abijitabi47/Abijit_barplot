import './globals.css'; // Merged global styles here

export const metadata = {
  title: 'My Data Visualization App',
  description: 'Converted from React to Next.js',
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
