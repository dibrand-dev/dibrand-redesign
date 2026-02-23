import { getDictionary } from "@/lib/dictionaries";
import ContactForm from "@/components/ContactForm";

export default async function ContactPage(props: { params: Promise<{ lang: "en" | "es" }> }) {
    const params = await props.params;
    const dict = await getDictionary(params.lang);

    return (
        <main className="flex min-h-screen flex-col items-center justify-center p-4 bg-white">
            <h1 className="text-3xl font-bold mb-8 text-[var(--color-corporate-grey)]">
                {dict.contact.title}
            </h1>
            <ContactForm dict={dict} />
        </main>
    );
}
