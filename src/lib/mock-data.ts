export type Contribution = {
  id: string;
  discord_name: string;
  discord_username: string;
  x_handle: string;
  discord_level?: number;
  contribution_types: string[];
  description: string;
  media_urls: string[];
  likes: number;
  created_at: string;
};

export const MOCK_CONTRIBUTIONS: Contribution[] = [
  {
    id: "1",
    discord_name: "CryptoWizard",
    discord_username: "cryptowizard#1234",
    x_handle: "@cryptowiz_eth",
    contribution_types: ["Art", "Screenshot"],
    description: "Designed a new 3D rendered logo concept for Concrete, inspired by brutalist architecture and DeFi transparency.",
    media_urls: ["https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?q=80&w=800&auto=format&fit=crop"],
    likes: 142,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 2).toISOString(), // 2 hours ago
  },
  {
    id: "2",
    discord_name: "DeFi Degen",
    discord_username: "defidegen#5678",
    x_handle: "@defidegen",
    contribution_types: ["Thread"],
    description: "Wrote a comprehensive 15-tweet thread explaining how Concrete's yield mechanics work compared to traditional lending protocols.",
    media_urls: ["https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=800&auto=format&fit=crop"],
    likes: 89,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 5).toISOString(), // 5 hours ago
  },
  {
    id: "3",
    discord_name: "MemeLord",
    discord_username: "memelord#9999",
    x_handle: "@concrete_memes",
    contribution_types: ["Meme"],
    description: "When the yield hits different. Just a quick meme I whipped up for the community.",
    media_urls: ["https://images.unsplash.com/photo-1526304640581-d334cdbbf45e?q=80&w=800&auto=format&fit=crop"],
    likes: 256,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 24).toISOString(), // 1 day ago
  },
  {
    id: "4",
    discord_name: "DevGirl",
    discord_username: "devgirl#1111",
    x_handle: "@devgirl_xyz",
    contribution_types: ["Screenshot", "Other"],
    description: "Built a custom dashboard tracking Concrete TVL using Dune Analytics.",
    media_urls: ["https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop"],
    likes: 312,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 48).toISOString(), // 2 days ago
  },
  {
    id: "5",
    discord_name: "VideoCreator",
    discord_username: "video#2222",
    x_handle: "@videocreator",
    contribution_types: ["Video"],
    description: "A quick 60-second explanation of why Concrete is the next big thing in DeFi.",
    media_urls: ["https://images.unsplash.com/photo-1611162616305-c69b3fa7fbe0?q=80&w=800&auto=format&fit=crop"],
    likes: 73,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 72).toISOString(), // 3 days ago
  },
  {
    id: "6",
    discord_name: "Anonymous",
    discord_username: "anon#0000",
    x_handle: "@anon",
    contribution_types: ["Other"],
    description: "Compiled a list of resources for newcomers to the Concrete community.",
    media_urls: ["https://images.unsplash.com/photo-1456324504439-367cee3b3c32?q=80&w=800&auto=format&fit=crop"],
    likes: 45,
    created_at: new Date(Date.now() - 1000 * 60 * 60 * 96).toISOString(), // 4 days ago
  }
];
