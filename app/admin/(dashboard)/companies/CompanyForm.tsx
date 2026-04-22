'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { ArrowLeft, Save, Loader2, Building2, User, Mail, Phone, Smartphone } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'react-hot-toast';
import PhoneInput from 'react-phone-number-input';
import 'react-phone-number-input/style.css';
import { createCompany, updateCompany } from './actions';

interface CompanyFormProps {
    initialData?: any;
    isEditing?: boolean;
}

export default function CompanyForm({ initialData, isEditing = false }: CompanyFormProps) {
    const router = useRouter();
    const [loading, setLoading] = useState(false);
    
    const [formData, setFormData] = useState({
        company_name: initialData?.company_name || '',
        contact_name: initialData?.contact_name || '',
        email: initialData?.email || '',
        phone: initialData?.phone || '',
        mobile: initialData?.mobile || ''
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handlePhoneChange = (value: string | undefined, field: 'phone' | 'mobile') => {
        setFormData(prev => ({ ...prev, [field]: value || '' }));
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setLoading(true);

        try {
            if (isEditing && initialData?.id) {
                await updateCompany(initialData.id, formData);
                toast.success('Empresa actualizada correctamente');
            } else {
                await createCompany(formData);
                toast.success('Empresa creada correctamente');
            }
            router.push('/admin/companies');
        } catch (error) {
            console.error('Error saving company:', error);
            toast.error('Hubo un error al guardar la empresa');
        } finally {
            setLoading(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className="max-w-4xl space-y-10 animate-in fade-in slide-in-from-bottom-4 duration-700 pb-20">
            <div className="flex items-center justify-between">
                <div className="flex items-center gap-4">
                    <Link 
                        href="/admin/companies" 
                        className="w-10 h-10 rounded-full border border-[#E2E8F0] flex items-center justify-center text-[#737785] hover:bg-slate-50 transition-all active:scale-90"
                    >
                        <ArrowLeft size={20} />
                    </Link>
                    <div>
                        <h1 className="text-[28px] font-bold text-[#191C1D] tracking-tight">
                            {isEditing ? 'Editar Empresa' : 'Alta de Nueva Empresa'}
                        </h1>
                        <p className="text-[#737785] text-[15px]">Completa los datos del contacto principal del cliente.</p>
                    </div>
                </div>
                <button
                    type="submit"
                    disabled={loading}
                    className="flex items-center gap-2 bg-[#0040A1] text-white px-8 py-3 rounded-full text-[14px] font-bold hover:bg-[#003380] transition-all shadow-lg shadow-blue-900/10 active:scale-95 disabled:opacity-50 disabled:active:scale-100"
                >
                    {loading ? <Loader2 className="animate-spin" size={18} /> : <Save size={18} />}
                    {isEditing ? 'Guardar Cambios' : 'Registrar Empresa'}
                </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                {/* General Info Section */}
                <div className="bg-white p-8 rounded-3xl border border-[#E2E8F0] space-y-6">
                    <div className="flex items-center gap-3 pb-2 border-b border-[#F1F5F9]">
                        <div className="w-8 h-8 rounded-lg bg-orange-50 flex items-center justify-center text-orange-500">
                            <Building2 size={18} />
                        </div>
                        <h2 className="text-[14px] font-black text-[#191C1D] tracking-widest uppercase">DATOS DE LA EMPRESA</h2>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[12px] font-bold text-[#737785] ml-1">Nombre Real de la Empresa</label>
                        <input
                            required
                            type="text"
                            name="company_name"
                            value={formData.company_name}
                            onChange={handleChange}
                            placeholder="Ej: Google Argentina"
                            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-4 py-3.5 text-[15px] font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#0040A1]/10 focus:border-[#0040A1] focus:bg-white"
                        />
                        <p className="text-[11px] text-[#737785] italic ml-1">Este nombre solo es visible para Administradores.</p>
                    </div>

                    {isEditing && (
                        <div className="space-y-1.5">
                            <label className="text-[12px] font-bold text-[#737785] ml-1 text-blue-600">Código Empresa (Privado)</label>
                            <input
                                disabled
                                type="text"
                                value={initialData?.company_code}
                                className="w-full bg-blue-50 border border-blue-100 rounded-2xl px-4 py-3.5 text-[15px] font-bold tracking-widest text-blue-700 cursor-not-allowed uppercase"
                            />
                        </div>
                    )}
                </div>

                {/* Contact Section */}
                <div className="bg-white p-8 rounded-3xl border border-[#E2E8F0] space-y-6">
                    <div className="flex items-center gap-3 pb-2 border-b border-[#F1F5F9]">
                        <div className="w-8 h-8 rounded-lg bg-emerald-50 flex items-center justify-center text-emerald-500">
                            <User size={18} />
                        </div>
                        <h2 className="text-[14px] font-black text-[#191C1D] tracking-widest uppercase">CONTACTO PRINCIPAL</h2>
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[12px] font-bold text-[#737785] ml-1">Nombre y Apellido</label>
                        <input
                            required
                            type="text"
                            name="contact_name"
                            value={formData.contact_name}
                            onChange={handleChange}
                            placeholder="Nombre del contacto..."
                            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-4 py-3.5 text-[15px] font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#0040A1]/10 focus:border-[#0040A1] focus:bg-white"
                        />
                    </div>

                    <div className="space-y-1.5">
                        <label className="text-[12px] font-bold text-[#737785] ml-1">Email de Contacto</label>
                        <input
                            required
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="email@empresa.com"
                            className="w-full bg-[#F8FAFC] border border-[#E2E8F0] rounded-2xl px-4 py-3.5 text-[15px] font-medium transition-all focus:outline-none focus:ring-2 focus:ring-[#0040A1]/10 focus:border-[#0040A1] focus:bg-white"
                        />
                    </div>
                </div>

                {/* Phones Section */}
                <div className="bg-white p-8 rounded-3xl border border-[#E2E8F0] space-y-6 col-span-1 md:col-span-2">
                    <div className="flex items-center gap-3 pb-2 border-b border-[#F1F5F9]">
                        <div className="w-8 h-8 rounded-lg bg-indigo-50 flex items-center justify-center text-indigo-500">
                            <Phone size={18} />
                        </div>
                        <h2 className="text-[14px] font-black text-[#191C1D] tracking-widest uppercase">TELÉFONOS Y COMUNICACIÓN</h2>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                        <div className="space-y-1.5 custom-phone-input">
                            <label className="text-[12px] font-bold text-[#737785] ml-1">Teléfono Empresa</label>
                            <PhoneInput
                                placeholder="Ingresa el teléfono"
                                value={formData.phone}
                                onChange={(val) => handlePhoneChange(val, 'phone')}
                                defaultCountry="AR"
                            />
                        </div>

                        <div className="space-y-1.5 custom-phone-input">
                            <label className="text-[12px] font-bold text-[#737785] ml-1">Celular / WhatsApp</label>
                            <PhoneInput
                                placeholder="Ingresa el celular"
                                value={formData.mobile}
                                onChange={(val) => handlePhoneChange(val, 'mobile')}
                                defaultCountry="AR"
                            />
                        </div>
                    </div>
                </div>
            </div>

            <style jsx global>{`
                .custom-phone-input .PhoneInput {
                    background: #F8FAFC;
                    border: 1px solid #E2E8F0;
                    border-radius: 1.5rem;
                    padding: 0.875rem 1rem;
                    font-size: 0.9375rem;
                    transition: all 0.2s;
                }
                .custom-phone-input .PhoneInput:focus-within {
                    background: white;
                    border-color: #0040A1;
                    box-shadow: 0 0 0 2px rgba(0, 64, 161, 0.1);
                }
                .custom-phone-input .PhoneInputInput {
                    border: none;
                    background: transparent;
                    outline: none;
                    font-family: inherit;
                    width: 100%;
                    padding-left: 0.5rem;
                }
                .custom-phone-input .PhoneInputCountry {
                    border-right: 1px solid #E2E8F0;
                    padding-right: 0.75rem;
                    margin-right: 0.75rem;
                }
            `}</style>
        </form>
    );
}
