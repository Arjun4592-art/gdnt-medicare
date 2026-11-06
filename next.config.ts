import type { NextConfig } from 'next'

const nextConfig: NextConfig = {
  /* config options here */
  reactCompiler: true,
  images: {
    // Dev networks on IPv6-only/NAT64 DNS64 setups resolve public hosts
    // (like Supabase Storage) into the reserved 64:ff9b::/96 range, which
    // Next's SSRF guard otherwise blocks even though the underlying IP is public.
    dangerouslyAllowLocalIP: true,
    remotePatterns: [
      {
        protocol: 'https',
        hostname: '*.supabase.co',
        pathname: '/storage/v1/object/public/**',
      },
      {
        protocol: 'https',
        hostname: 'res.cloudinary.com',
        pathname: '/**',
      },
    ],
  },
}

export default nextConfig
