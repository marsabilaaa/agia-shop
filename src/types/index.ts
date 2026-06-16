export type Product = {
  id: string;
  name: string;
  description: string | null;
  price: number;
  category: string;
  stock: number;
  image_url: string | null;
  created_at: string;
  updated_at: string;
};

export type Conversation = {
  id: string;
  session_id: string;
  created_at: string;
  updated_at: string;
  messages?: Message[];
};

export type Message = {
  id: string;
  conversation_id: string;
  role: "user" | "assistant";
  content: string;
  created_at: string;
};
