import Navbar from "@/components/products/Navbar";
import ChatWidget from "@/components/chat/ChatWidget";

export default function PublicLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen bg-slate-50">
      <Navbar />
      <main className="max-w-7xl mx-auto px-4 py-8">{children}</main>
      <ChatWidget />
    </div>
  );
}
