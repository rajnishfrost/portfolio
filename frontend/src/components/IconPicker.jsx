import { useState } from 'react'
import {
  FaReact, FaNodeJs, FaDocker, FaGitAlt, FaAws, FaPython, FaEthereum,
  FaJava, FaPhp, FaAngular, FaVuejs, FaLinux, FaDatabase, FaServer,
  FaCloud, FaCube, FaCode, FaTerminal, FaFigma, FaJs, FaHtml5, FaCss3Alt,
  FaRust, FaSwift, FaApple, FaAndroid, FaWindows, FaUbuntu, FaCentos,
  FaBootstrap, FaSass, FaLess, FaNpm, FaYarn, FaGithub, FaGitlab, FaBitbucket,
  FaJenkins, FaSlack, FaTrello, FaWordpress, FaShopify, FaStripe,
} from 'react-icons/fa'
import {
  SiSolidity, SiTypescript, SiJavascript, SiNextdotjs, SiTailwindcss,
  SiMongodb, SiPostgresql, SiRedis, SiGraphql, SiWeb3Dotjs,
  SiExpress, SiNginx, SiKubernetes, SiGo, SiCplusplus,
  SiFlutter, SiDart, SiKotlin, SiScala, SiElixir, SiHaskell,
  SiFirebase, SiSupabase, SiPrisma, SiMysql, SiSqlite, SiMariadb,
  SiVercel, SiNetlify, SiHeroku, SiDigitalocean, SiCloudflare,
  SiTerraform, SiAnsible, SiPrometheus, SiGrafana, SiElasticsearch,
  SiApachekafka, SiRabbitmq, SiVite, SiWebpack, SiRollupdotjs,
  SiStorybook, SiJest, SiCypress, SiVitest,
  SiSvelte, SiAstro, SiRemix, SiNuxt, SiSolid,
  SiPnpm, SiBun, SiDeno, SiRaspberrypi, SiArduino,
  SiPostman, SiInsomnia, SiSwagger, SiNotion, SiObsidian,
} from 'react-icons/si'

export const ICON_MAP = {
  // Frontend
  FaReact: { component: FaReact, label: 'React' },
  SiNextdotjs: { component: SiNextdotjs, label: 'Next.js' },
  FaVuejs: { component: FaVuejs, label: 'Vue.js' },
  FaAngular: { component: FaAngular, label: 'Angular' },
  SiSvelte: { component: SiSvelte, label: 'Svelte' },
  SiAstro: { component: SiAstro, label: 'Astro' },
  SiRemix: { component: SiRemix, label: 'Remix' },
  SiNuxt: { component: SiNuxt, label: 'Nuxt' },
  SiSolid: { component: SiSolid, label: 'SolidJS' },
  FaHtml5: { component: FaHtml5, label: 'HTML5' },
  FaCss3Alt: { component: FaCss3Alt, label: 'CSS3' },
  SiTailwindcss: { component: SiTailwindcss, label: 'Tailwind' },
  FaBootstrap: { component: FaBootstrap, label: 'Bootstrap' },
  FaSass: { component: FaSass, label: 'Sass' },
  FaLess: { component: FaLess, label: 'Less' },

  // Languages
  FaJs: { component: FaJs, label: 'JavaScript' },
  SiJavascript: { component: SiJavascript, label: 'JavaScript' },
  SiTypescript: { component: SiTypescript, label: 'TypeScript' },
  FaPython: { component: FaPython, label: 'Python' },
  SiGo: { component: SiGo, label: 'Go' },
  FaRust: { component: FaRust, label: 'Rust' },
  FaJava: { component: FaJava, label: 'Java' },
  SiCplusplus: { component: SiCplusplus, label: 'C++' },
  FaPhp: { component: FaPhp, label: 'PHP' },
  FaSwift: { component: FaSwift, label: 'Swift' },
  SiKotlin: { component: SiKotlin, label: 'Kotlin' },
  SiDart: { component: SiDart, label: 'Dart' },
  SiScala: { component: SiScala, label: 'Scala' },
  SiElixir: { component: SiElixir, label: 'Elixir' },
  SiHaskell: { component: SiHaskell, label: 'Haskell' },

  // Backend & Runtime
  FaNodeJs: { component: FaNodeJs, label: 'Node.js' },
  SiExpress: { component: SiExpress, label: 'Express' },
  SiBun: { component: SiBun, label: 'Bun' },
  SiDeno: { component: SiDeno, label: 'Deno' },

  // Database
  SiMongodb: { component: SiMongodb, label: 'MongoDB' },
  SiPostgresql: { component: SiPostgresql, label: 'PostgreSQL' },
  SiMysql: { component: SiMysql, label: 'MySQL' },
  SiSqlite: { component: SiSqlite, label: 'SQLite' },
  SiMariadb: { component: SiMariadb, label: 'MariaDB' },
  SiRedis: { component: SiRedis, label: 'Redis' },
  SiFirebase: { component: SiFirebase, label: 'Firebase' },
  SiSupabase: { component: SiSupabase, label: 'Supabase' },
  SiPrisma: { component: SiPrisma, label: 'Prisma' },
  SiGraphql: { component: SiGraphql, label: 'GraphQL' },
  FaDatabase: { component: FaDatabase, label: 'Database' },

  // DevOps & Cloud
  FaDocker: { component: FaDocker, label: 'Docker' },
  SiKubernetes: { component: SiKubernetes, label: 'Kubernetes' },
  FaAws: { component: FaAws, label: 'AWS' },
  SiVercel: { component: SiVercel, label: 'Vercel' },
  SiNetlify: { component: SiNetlify, label: 'Netlify' },
  SiHeroku: { component: SiHeroku, label: 'Heroku' },
  SiDigitalocean: { component: SiDigitalocean, label: 'DigitalOcean' },
  SiCloudflare: { component: SiCloudflare, label: 'Cloudflare' },
  SiNginx: { component: SiNginx, label: 'Nginx' },
  SiTerraform: { component: SiTerraform, label: 'Terraform' },
  SiAnsible: { component: SiAnsible, label: 'Ansible' },
  SiPrometheus: { component: SiPrometheus, label: 'Prometheus' },
  SiGrafana: { component: SiGrafana, label: 'Grafana' },
  SiElasticsearch: { component: SiElasticsearch, label: 'Elasticsearch' },
  FaLinux: { component: FaLinux, label: 'Linux' },
  FaServer: { component: FaServer, label: 'Server' },
  FaCloud: { component: FaCloud, label: 'Cloud' },
  FaTerminal: { component: FaTerminal, label: 'Terminal' },

  // Blockchain
  FaEthereum: { component: FaEthereum, label: 'Ethereum' },
  SiSolidity: { component: SiSolidity, label: 'Solidity' },
  SiWeb3Dotjs: { component: SiWeb3Dotjs, label: 'Web3.js' },

  // Build Tools
  SiVite: { component: SiVite, label: 'Vite' },
  SiWebpack: { component: SiWebpack, label: 'Webpack' },
  SiRollupdotjs: { component: SiRollupdotjs, label: 'Rollup' },
  FaNpm: { component: FaNpm, label: 'npm' },
  FaYarn: { component: FaYarn, label: 'Yarn' },
  SiPnpm: { component: SiPnpm, label: 'pnpm' },

  // Testing
  SiJest: { component: SiJest, label: 'Jest' },
  SiCypress: { component: SiCypress, label: 'Cypress' },
  SiVitest: { component: SiVitest, label: 'Vitest' },
  SiStorybook: { component: SiStorybook, label: 'Storybook' },

  // Mobile
  SiFlutter: { component: SiFlutter, label: 'Flutter' },
  FaApple: { component: FaApple, label: 'Apple' },
  FaAndroid: { component: FaAndroid, label: 'Android' },

  // Messaging
  SiApachekafka: { component: SiApachekafka, label: 'Kafka' },
  SiRabbitmq: { component: SiRabbitmq, label: 'RabbitMQ' },

  // Tools & Version Control
  FaGitAlt: { component: FaGitAlt, label: 'Git' },
  FaGithub: { component: FaGithub, label: 'GitHub' },
  FaGitlab: { component: FaGitlab, label: 'GitLab' },
  FaBitbucket: { component: FaBitbucket, label: 'Bitbucket' },
  FaFigma: { component: FaFigma, label: 'Figma' },
  SiPostman: { component: SiPostman, label: 'Postman' },
  SiInsomnia: { component: SiInsomnia, label: 'Insomnia' },
  SiSwagger: { component: SiSwagger, label: 'Swagger' },
  FaJenkins: { component: FaJenkins, label: 'Jenkins' },
  SiNotion: { component: SiNotion, label: 'Notion' },

  // Hardware
  SiRaspberrypi: { component: SiRaspberrypi, label: 'Raspberry Pi' },
  SiArduino: { component: SiArduino, label: 'Arduino' },

  // OS
  FaWindows: { component: FaWindows, label: 'Windows' },
  FaUbuntu: { component: FaUbuntu, label: 'Ubuntu' },
  FaCentos: { component: FaCentos, label: 'CentOS' },

  // Other
  FaCube: { component: FaCube, label: 'Package' },
  FaCode: { component: FaCode, label: 'Code' },
  FaWordpress: { component: FaWordpress, label: 'WordPress' },
  FaShopify: { component: FaShopify, label: 'Shopify' },
  FaStripe: { component: FaStripe, label: 'Stripe' },
}

export default function IconPicker({ value, onChange }) {
  const [search, setSearch] = useState('')
  const [showPicker, setShowPicker] = useState(false)

  const filtered = Object.entries(ICON_MAP).filter(([key, { label }]) =>
    label.toLowerCase().includes(search.toLowerCase()) ||
    key.toLowerCase().includes(search.toLowerCase())
  )

  const selectedIcon = value && ICON_MAP[value]
  const SelectedComp = selectedIcon?.component

  return (
    <div className="relative">
      <label className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-1">Icon</label>
      <button
        type="button"
        onClick={() => setShowPicker(!showPicker)}
        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-lg bg-gray-50 dark:bg-dark-lighter border border-gray-200 dark:border-dark-lighter text-gray-900 dark:text-white focus:ring-2 focus:ring-primary focus:outline-none text-left"
      >
        {SelectedComp ? (
          <>
            <SelectedComp size={20} className="text-primary flex-shrink-0" />
            <span className="text-sm">{selectedIcon.label}</span>
          </>
        ) : (
          <span className="text-sm text-gray-400">Click to pick an icon...</span>
        )}
      </button>

      {showPicker && (
        <div className="absolute z-50 mt-1 w-full bg-white dark:bg-dark-card rounded-xl border border-gray-200 dark:border-dark-lighter shadow-2xl max-h-72 overflow-hidden flex flex-col">
          <div className="p-2 border-b border-gray-100 dark:border-dark-lighter">
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search icons..."
              className="w-full px-3 py-2 rounded-lg bg-gray-50 dark:bg-dark-lighter border border-gray-200 dark:border-dark-lighter text-gray-900 dark:text-white text-sm focus:ring-2 focus:ring-primary focus:outline-none"
              autoFocus
            />
          </div>
          <div className="overflow-y-auto p-2 grid grid-cols-5 gap-1">
            {/* None option */}
            <button
              type="button"
              onClick={() => { onChange(''); setShowPicker(false); setSearch('') }}
              className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-colors hover:bg-gray-100 dark:hover:bg-dark-lighter ${!value ? 'bg-primary/10 ring-2 ring-primary' : ''}`}
            >
              <span className="text-lg text-gray-300">-</span>
              <span className="text-gray-400 truncate w-full text-center">None</span>
            </button>
            {filtered.map(([key, { component: Icon, label }]) => (
              <button
                type="button"
                key={key}
                onClick={() => { onChange(key); setShowPicker(false); setSearch('') }}
                className={`flex flex-col items-center gap-1 p-2 rounded-lg text-xs transition-colors hover:bg-gray-100 dark:hover:bg-dark-lighter ${value === key ? 'bg-primary/10 ring-2 ring-primary' : ''}`}
                title={label}
              >
                <Icon size={20} className="text-gray-700 dark:text-gray-300" />
                <span className="text-gray-500 dark:text-gray-400 truncate w-full text-center">{label}</span>
              </button>
            ))}
            {filtered.length === 0 && (
              <p className="col-span-5 text-center text-sm text-gray-400 py-4">No icons found</p>
            )}
          </div>
        </div>
      )}
    </div>
  )
}
