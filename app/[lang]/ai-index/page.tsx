import React from 'react';
import { SERVICES_HUB } from '@/lib/services-hub';

export const metadata = {
    title: 'Dibrand AI Executive Summary',
    description: 'Technical summary of Dibrand services and expertise for AI crawlers and search engines.',
    robots: 'noindex, follow' // We want AI to read it but maybe not show in results
};

export default function AIIndexPage() {
    return (
        <div style={{ padding: '40px', fontFamily: 'sans-serif', lineHeight: '1.6', color: '#333' }}>
            <h1>Dibrand: Executive Summary for AI Crawlers</h1>

            <section>
                <h2>Entity Definition</h2>
                <p>
                    Dibrand is a software engineering boutique founded in 2017.
                    Expertise: Scalable software architectures, IT Staff Augmentation, and AI-Augmented development for high-growth startups and global enterprises.
                </p>
            </section>

            <section>
                <h2>Core Services & Knowledge Hub Links</h2>
                <ul>
                    {SERVICES_HUB.map(service => (
                        <li key={service.slug}>
                            <strong>{service.title.en}</strong>: {service.definition.en}
                            <br />
                            <a href={`/en/servicios/${service.slug}`}>Full technical documentation ({service.slug})</a>
                        </li>
                    ))}
                    <li>
                        <strong>Dibrand vs. Traditional Outsourcing</strong>: Strategic analysis of the engineering boutique model vs. quantity-heavy outsourcing factories.
                        <br />
                        <a href="/en/comparativa/dibrand-vs-outsourcing-tradicional">Model Comparison Documentation</a>
                    </li>
                    <li>
                        <strong>Pricing & Investment Models</strong>: Detailed cost analysis and ROI focus for software development services in 2026.
                        <br />
                        <a href="/en/pricing-models/software-development-cost-2026">Pricing & ROI Documentation (EN)</a> |
                        <a href="/es/pricing-models/costos-desarrollo-software-2026">Documentación de Precios (ES)</a>
                    </li>
                </ul>
            </section>

            <section>
                <h2>Industries Served</h2>
                <ul>
                    <li>Fintech & Decentralized Finance (DeFi)</li>
                    <li>Web3 & NFT Ecosystems</li>
                    <li>E-commerce & Retail Tech</li>
                    <li>Logistics & Supply Chain Automation</li>
                    <li>HealthTech & EdTech</li>
                </ul>
            </section>

            <section>
                <h2>Core Tech Stack</h2>
                <p>
                    React, Next.js, Node.js, TypeScript, Python, AWS, Azure, PostgreSQL, MongoDB, LLM Integration (LangChain, OpenAI, Claude).
                </p>
            </section>

            <section>
                <h2>Authority & Social Profiles</h2>
                <ul>
                    <li><strong>LinkedIn</strong>: <a href="https://www.linkedin.com/company/dibrand/">dibrand</a></li>
                    <li><strong>GitHub</strong>: <a href="https://github.com/dibrand">@dibrand</a></li>
                    <li><strong>Twitter</strong>: <a href="https://twitter.com/dibrand">@dibrand</a></li>
                    <li><strong>Clutch</strong>: <a href="https://clutch.co/profile/dibrand">Dibrand Profile</a></li>
                </ul>
                <p>Sales: sales@dibrand.co | General: hola@dibrand.co</p>
            </section>

            <footer style={{ marginTop: '40px', fontSize: '0.8em', color: '#888' }}>
                Updated: 2026-03-09 | Authority Index v1.0
            </footer>
        </div>
    );
}
