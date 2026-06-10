import { Play, Star, LayoutDashboard, Brain, Database, GitBranch, Puzzle, Users, Plug, Send, Shield, Zap } from 'lucide-react'

function GithubIcon({ size = 18 }: { size?: number }) {
  return (
    <svg width={size} height={size} viewBox="0 0 24 24" fill="currentColor">
      <path d="M12 0C5.37 0 0 5.37 0 12c0 5.31 3.435 9.795 8.205 11.385.6.105.825-.255.825-.57 0-.285-.015-1.23-.015-2.235-3.015.555-3.795-.735-4.035-1.41-.135-.345-.72-1.41-1.23-1.695-.42-.225-1.02-.78-.015-.795.945-.015 1.62.87 1.845 1.23 1.08 1.815 2.805 1.305 3.495.99.105-.78.42-1.305.765-1.605-2.67-.3-5.46-1.335-5.46-5.925 0-1.305.465-2.385 1.23-3.225-.12-.3-.54-1.53.12-3.18 0 0 1.005-.315 3.3 1.23.96-.27 1.98-.405 3-.405s2.04.135 3 .405c2.295-1.56 3.3-1.23 3.3-1.23.66 1.65.24 2.88.12 3.18.765.84 1.23 1.905 1.23 3.225 0 4.605-2.805 5.625-5.475 5.925.435.375.81 1.095.81 2.22 0 1.605-.015 2.895-.015 3.3 0 .315.225.69.825.57A12.02 12.02 0 0 0 24 12c0-6.63-5.37-12-12-12z" />
    </svg>
  )
}
import { Navbar } from '../components/landing/Navbar'
import { FeatureCard } from '../components/landing/FeatureCard'
import { PricingCard } from '../components/landing/PricingCard'
import { StepCard } from '../components/landing/StepCard'

export function LandingPage() {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      <Navbar />

      <section className="relative pt-20 pb-24 px-6 bg-gradient-to-b from-surface-elevated to-background overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]" style={{ backgroundImage: 'radial-gradient(circle, #3B82F6 1px, transparent 1px)', backgroundSize: '24px 24px' }} />
        <div className="max-w-7xl mx-auto text-center relative">
          <h1 className="text-4xl md:text-5xl 2xl:text-6xl font-bold text-text-primary tracking-tight leading-tight max-w-4xl mx-auto">
            Command Your AI Workforce
          </h1>
          <p className="mt-4 text-lg text-text-secondary max-w-2xl mx-auto leading-relaxed">
            The open-source operating system for autonomous agents. Delegate goals. Watch them execute. Intervene when it matters.
          </p>
          <div className="flex items-center justify-center gap-3 mt-8">
            <button className="px-6 py-3 rounded-md bg-primary text-white font-medium text-sm hover:bg-primary-hover hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-150">
              Get Started Free
            </button>
            <button className="flex items-center gap-2 px-6 py-3 rounded-md bg-surface border border-border text-text-secondary font-medium text-sm hover:bg-surface-elevated transition-colors duration-150">
              <GithubIcon size={18} />
              View on GitHub
            </button>
          </div>
          <div className="flex items-center justify-center gap-8 mt-10 text-sm text-text-muted flex-wrap">
            <span><Star size={14} className="inline text-warning mr-1" /><span className="font-mono text-text-secondary">5,000+</span> GitHub Stars</span>
            <span><span className="font-mono text-text-secondary">1,000+</span> Active Fleets</span>
            <span><span className="font-mono text-text-secondary">50M+</span> Tasks Executed</span>
          </div>
          <div className="mt-12 max-w-4xl mx-auto aspect-video bg-surface border border-border rounded-xl shadow-lg flex flex-col items-center justify-center gap-3 hover:border-border-focus hover:scale-[1.01] transition-all duration-150">
            <Play size={48} className="text-text-muted" />
            <span className="text-sm text-text-muted">Watch 2-min overview</span>
          </div>
        </div>
      </section>

      <section id="features" className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-text-primary text-center">Everything You Need to Run Agents at Scale</h2>
        <p className="mt-3 text-text-secondary text-center max-w-2xl mx-auto">From single agents to swarms. From first task to enterprise audit.</p>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
          {[
            { icon: <LayoutDashboard size={20} />, title: 'Mission Control', description: 'Real-time dashboard with heartbeat monitoring, kanban boards, and live activity feeds.' },
            { icon: <Brain size={20} />, title: 'Transparent Reasoning', description: 'Every decision visible. Checkpoint timelines, reasoning traces, and confidence scores.' },
            { icon: <Database size={20} />, title: 'Human Memory', description: 'Semantic, episodic, and procedural memory. Editable via Obsidian sync. Agents learn. You correct.' },
            { icon: <GitBranch size={20} />, title: 'Smart Routing', description: 'Automatic model selection based on task type, cost limits, and capability matching.' },
            { icon: <Puzzle size={20} />, title: 'Skill Marketplace', description: 'Install community-built skills. Or let agents evolve their own. Revenue share: 70% creator.' },
            { icon: <Users size={20} />, title: 'Swarm Intelligence', description: 'Multi-agent teams with consensus voting. Debate, decide, execute.' },
          ].map((feat) => (
            <FeatureCard key={feat.title} icon={feat.icon} title={feat.title} description={feat.description} />
          ))}
        </div>
      </section>

      <section id="how-it-works" className="py-20 px-6 bg-surface border-y border-border">
        <div className="max-w-7xl mx-auto">
          <h2 className="text-3xl font-semibold text-text-primary text-center">Deploy in Minutes, Not Months</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mt-12">
            {[
              { number: 1, icon: <Plug size={20} />, title: 'Connect', description: 'Add your API keys. Choose local or cloud models.' },
              { number: 2, icon: <Send size={20} />, title: 'Delegate', description: 'Describe your goal in plain English. The router picks the right agent and model.' },
              { number: 3, icon: <Shield size={20} />, title: 'Command', description: 'Monitor in real-time. Pause, resume, or retry from any checkpoint.' },
            ].map((step) => (
              <StepCard key={step.number} number={step.number} icon={step.icon} title={step.title} description={step.description} />
            ))}
          </div>
        </div>
      </section>

      <section id="pricing" className="py-20 px-6 max-w-7xl mx-auto">
        <h2 className="text-3xl font-semibold text-text-primary text-center">Simple Pricing. No Surprises.</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mt-12">
          {[
            { plan: 'Free', price: '$0', features: ['3 agents', '1 provider', 'Basic skills', 'Community support'], cta: 'Get Started', ctaVariant: 'secondary' as const, popular: false, icon: <Zap size={18} /> },
            { plan: 'Pro', price: '$49', features: ['10 agents', 'All providers', 'Premium skills', 'Priority routing'], cta: 'Start Pro', ctaVariant: 'primary' as const, popular: true, icon: <Star size={18} /> },
            { plan: 'Team', price: '$199', features: ['Unlimited agents', 'Swarm mode', 'Custom skills', 'Slack integration'], cta: 'Start Team', ctaVariant: 'secondary' as const, popular: false, icon: <Users size={18} /> },
            { plan: 'Enterprise', price: 'Custom', features: ['On-premise', 'SSO', 'Audit logs', 'Dedicated support'], cta: 'Contact Sales', ctaVariant: 'secondary' as const, popular: false, icon: <Shield size={18} /> },
          ].map((p) => (
            <PricingCard key={p.plan} {...p} />
          ))}
        </div>
        <p className="mt-6 text-center text-sm text-text-muted">All plans include self-hosting, open-source core, and Bumblebee security scanning.</p>
      </section>

      <section className="py-20 px-6 bg-primary-muted border-y border-border">
        <div className="max-w-3xl mx-auto text-center space-y-4">
          <h2 className="text-3xl font-semibold text-text-primary">Ready to Command Your AI Workforce?</h2>
          <p className="text-text-secondary">Open source. Self-hosted. Free to start.</p>
          <div className="flex items-center justify-center gap-3 pt-2">
            <button className="px-6 py-3 rounded-md bg-primary text-white font-medium hover:bg-primary-hover hover:shadow-[0_0_20px_rgba(59,130,246,0.3)] transition-all duration-150">Get Started Free</button>
            <button className="px-6 py-3 rounded-md text-text-secondary font-medium hover:text-text-primary transition-colors duration-150">Read the Docs →</button>
          </div>
        </div>
      </section>

      <footer className="py-16 px-6 max-w-7xl mx-auto border-t border-border">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8">
          {[
            { title: 'Product', links: ['Features', 'Pricing', 'Changelog', 'Roadmap'] },
            { title: 'Resources', links: ['Documentation', 'API Reference', 'Skill Marketplace', 'Community'] },
            { title: 'Company', links: ['About', 'Blog', 'Careers', 'Contact'] },
            { title: 'Legal', links: ['Privacy Policy', 'Terms of Service', 'License', 'Security'] },
          ].map((col) => (
            <div key={col.title}>
              <h4 className="text-sm font-semibold text-text-primary mb-3">{col.title}</h4>
              <ul className="space-y-2">
                {col.links.map((link) => (
                  <li key={link}><a href="#" className="text-sm text-text-secondary hover:text-text-primary transition-colors duration-150">{link}</a></li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <div className="flex items-center justify-between mt-12 pt-8 border-t border-border text-sm text-text-muted flex-wrap gap-3">
          <span>© 2026 HelmOS. Open source under MIT License.</span>
          <div className="flex items-center gap-4">
            <a href="https://github.com" className="flex items-center gap-1.5 text-text-secondary hover:text-text-primary transition-colors duration-150">
              <GithubIcon size={16} />
              <Star size={14} className="text-warning" />
              <span className="text-xs">Star us</span>
            </a>
          </div>
        </div>
      </footer>
    </div>
  )
}
