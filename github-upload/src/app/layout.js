import '../styles/globals.css';

export const metadata = {
  title: 'Fujisakura Airways',
  description: 'Premium airline services with exceptional customer experience',
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}