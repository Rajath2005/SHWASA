/** @type {import('next').NextConfig} */
const nextConfig = {
  images: {
    unoptimized: true,
  },
  async rewrites() {
    const apiOrigin = process.env.COPD_EFF_API_URL?.replace(/\/$/, '')

    return apiOrigin
      ? [{ source: '/api/:path*', destination: `${apiOrigin}/api/:path*` }]
      : []
  },
}

export default nextConfig
