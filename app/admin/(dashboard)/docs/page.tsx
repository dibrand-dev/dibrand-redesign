'use client';

import React, { useState, useEffect } from 'react';
import ReactMarkdown from 'react-markdown';
import rehypeSlug from 'rehype-slug';
import { BookOpen, ChevronRight, Info, CheckCircle2, Layout, Image as ImageIcon, Search } from 'lucide-react';

const DOCS_CONTENT = `
# 📘 Guía de Estilo de Contenidos - Dibrand 2026

Esta sección es el marco de referencia para asegurar que cada pieza de contenido publicada en **Dibrand** refuerce nuestra autoridad como **Boutique de Ingeniería** y sea optimizada para motores de búsqueda y modelos de IA (AEO).

---

## 1. Tono y Voz de Marca

### Seniority Real
Evitá términos genéricos como "soluciones integrales". Usá lenguaje que demuestre que somos ingenieros hablando con ingenieros (CTOs, Product Owners).

### Foco en el Impacto
El software es un medio, no el fin. Enfocá la narrativa en el valor de negocio y la escalabilidad (ej: "Reducción de latencia en un 30%" en lugar de "Mejoramos el servidor").

### Idioma y Localización
*   **Español:** Usar "vos" (Español Latinoamericano profesional).
*   **Inglés:** American English (Executive/Tech tone).

---

## 2. Estructura de "Nuestros Casos de Estudio"

Cada proyecto debe estructurarse para contar una historia de transformación técnica:

1.  **Título de Impacto:** Debe incluir el resultado o la tecnología core.
    *   *Ejemplo: "Arquitectura Microservicios para Escalamiento de Fintech".*
2.  **El Desafío (The Challenge):** Describir el problema crítico del cliente antes de nuestra intervención. (Max 2 párrafos).
3.  **La Solución (The Solution):** Stack tecnológico utilizado y por qué elegimos ese camino. Resaltar el valor de la "Ingeniería Boutique".
4.  **Resultados (Impact):** Datos duros, KPIs o testimonios que validen el éxito del proyecto.

---

## 3. Estándares Visuales (Multimedia)

*   **Imágenes Hero:** Relación 16:9. Deben ser de alta calidad, evitando el exceso de stock genérico. Priorizar capturas de producto o diagramas de arquitectura.
*   **SEO en Imágenes:** Todo archivo debe llevar un ALT Text descriptivo que incluya la marca (ej: "Dibrand - Dashboard escalable para e-commerce").

---

## 4. Checklist de Optimización para IA (AEO)

Antes de marcar un contenido como "Publicado", verificar:

*   [ ] **Mención de Marca:** El nombre Dibrand aparece asociado a los servicios principales.
*   [ ] **Keywords Semánticas:** Se incluyeron términos como Staff Augmentation, MVP, Seniority, Scalability.
*   [ ] **Jerarquía H2/H3:** El texto está bien dividido por encabezados para facilitar el rastreo de los crawlers.
*   [ ] **Consistencia Bilingüe:** La traducción al inglés mantiene el tono profesional y no es literal del español.
`;

export default function DocsPage() {
    const [activeId, setActiveId] = useState('');

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        setActiveId(entry.target.id);
                    }
                });
            },
            { rootMargin: '-100px 0px -70% 0px' }
        );

        document.querySelectorAll('h2[id], h3[id]').forEach((section) => {
            observer.observe(section);
        });

        return () => observer.disconnect();
    }, []);

    const scrollToSection = (e: React.MouseEvent<HTMLAnchorElement>, href: string) => {
        e.preventDefault();
        const id = href.replace('#', '');
        const element = document.getElementById(id);
        if (element) {
            const offset = 100;
            const bodyRect = document.body.getBoundingClientRect().top;
            const elementRect = element.getBoundingClientRect().top;
            const elementPosition = elementRect - bodyRect;
            const offsetPosition = elementPosition - offset;

            window.scrollTo({
                top: offsetPosition,
                behavior: 'smooth'
            });
            window.history.replaceState(null, '', href);
        }
    };

    const navItems = [
        { id: '1-tono-y-voz-de-marca', label: 'Voz de Marca', icon: Info },
        { id: '2-estructura-de-nuestros-casos-de-estudio', label: 'Casos de Estudio', icon: Layout },
        { id: '3-estandares-visuales-multimedia', label: 'Visuales', icon: ImageIcon },
        { id: '4-checklist-de-optimizacion-para-ia-aeo', label: 'Checklist IA', icon: CheckCircle2 },
    ];

    return (
        <div className="max-w-5xl mx-auto space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            {/* Page Header */}
            <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-admin-border pb-8">
                <div className="flex items-center gap-4">
                    <div className="w-14 h-14 rounded-2xl bg-admin-accent/10 flex items-center justify-center text-admin-accent shadow-sm border border-admin-accent/10">
                        <BookOpen size={28} />
                    </div>
                    <div>
                        <h1 className="text-3xl font-black text-admin-text-primary tracking-tight">Docs</h1>
                        <p className="text-admin-text-secondary text-sm mt-1 font-medium italic">Guía de Usuario y Estándares de Contenido.</p>
                    </div>
                </div>
                <div className="flex bg-admin-card-bg p-1.5 rounded-2xl border border-admin-border shadow-sm">
                    <div className="flex items-center gap-2 px-4 py-2 text-[11px] font-bold text-admin-accent uppercase tracking-widest bg-admin-accent/5 rounded-xl">
                        <Info size={14} />
                        Internal Use Only
                    </div>
                </div>
            </div>

            <div className="grid lg:grid-cols-4 gap-12">
                {/* Navigation Sidebar (Table of Contents) */}
                <aside className="lg:col-span-1 border-r border-admin-border pr-8 hidden lg:block h-fit sticky top-12">
                    <p className="text-[10px] font-black text-gray-400 uppercase tracking-[0.2em] mb-6">Contenidos</p>
                    <nav className="space-y-2">
                        {navItems.map((item) => {
                            const isActive = activeId === item.id;
                            return (
                                <a
                                    key={item.id}
                                    href={`#${item.id}`}
                                    onClick={(e) => scrollToSection(e, `#${item.id}`)}
                                    className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-sm font-bold transition-all group ${isActive
                                            ? 'bg-admin-accent/5 text-admin-accent shadow-sm translate-x-1'
                                            : 'text-admin-text-secondary hover:text-admin-accent hover:bg-admin-bg'
                                        }`}
                                >
                                    <item.icon size={16} className={`${isActive ? 'text-admin-accent' : 'text-gray-300 group-hover:text-admin-accent'} transition-colors`} />
                                    {item.label}
                                    {isActive && <div className="w-1 h-1 rounded-full bg-admin-accent ml-auto" />}
                                    <ChevronRight size={12} className={`ml-auto transition-all ${isActive ? 'opacity-100' : 'opacity-0 group-hover:opacity-100 group-hover:translate-x-0 -translate-x-2'}`} />
                                </a>
                            );
                        })}
                    </nav>
                </aside>

                {/* Main Content */}
                <div className="lg:col-span-3 space-y-8">
                    <div className="bg-admin-card-bg rounded-3xl border border-admin-border shadow-sm overflow-hidden p-8 md:p-12">
                        <article className="prose prose-slate max-w-none dark:prose-invert admin-docs-content
                            prose-headings:text-admin-text-primary prose-headings:font-black prose-headings:tracking-tight
                            prose-h1:text-4xl prose-h1:mb-12
                            prose-h2:text-2xl prose-h2:mt-16 prose-h2:mb-6 prose-h2:pb-4 prose-h2:border-b prose-h2:border-admin-border/50
                            prose-h3:text-lg prose-h3:mt-8 prose-h3:text-admin-accent
                            prose-p:text-admin-text-secondary prose-p:leading-relaxed prose-p:font-medium
                            prose-li:text-admin-text-secondary prose-li:font-medium
                            prose-strong:text-admin-text-primary prose-strong:font-bold
                            prose-hr:border-admin-border/50 prose-hr:my-12
                            ">
                            <ReactMarkdown rehypePlugins={[rehypeSlug]}>{DOCS_CONTENT}</ReactMarkdown>
                        </article>
                    </div>

                    {/* Quick Tips or Footer */}
                    <div className="bg-admin-accent/5 rounded-3xl p-8 border border-admin-accent/10 flex flex-col md:flex-row items-center gap-6">
                        <div className="w-12 h-12 rounded-2xl bg-admin-accent text-white flex items-center justify-center shrink-0 shadow-lg shadow-admin-accent/20">
                            <Search size={22} />
                        </div>
                        <div>
                            <h4 className="font-bold text-admin-text-primary">¿Tenés dudas sobre algún caso específico?</h4>
                            <p className="text-sm text-admin-text-secondary mt-1">Consultá al Lead de Ingeniería antes de publicar para asegurar la precisión técnica de los KPIs.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
