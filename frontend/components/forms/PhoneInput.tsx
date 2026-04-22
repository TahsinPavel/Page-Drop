"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { ChevronDown } from "lucide-react";
import { cn } from "@/lib/utils";

/* ── Country data ── */

export interface CountryOption {
    code: string;
    dial: string;
    flag: string;
    name: string;
}

export const COUNTRIES: CountryOption[] = [
    { code: "BD", dial: "+880", flag: "🇧🇩", name: "Bangladesh" },
    { code: "IN", dial: "+91", flag: "🇮🇳", name: "India" },
    { code: "PK", dial: "+92", flag: "🇵🇰", name: "Pakistan" },
    { code: "US", dial: "+1", flag: "🇺🇸", name: "United States" },
    { code: "GB", dial: "+44", flag: "🇬🇧", name: "United Kingdom" },
    { code: "AE", dial: "+971", flag: "🇦🇪", name: "UAE" },
    { code: "SA", dial: "+966", flag: "🇸🇦", name: "Saudi Arabia" },
    { code: "MY", dial: "+60", flag: "🇲🇾", name: "Malaysia" },
    { code: "SG", dial: "+65", flag: "🇸🇬", name: "Singapore" },
    { code: "AU", dial: "+61", flag: "🇦🇺", name: "Australia" },
];

const DEFAULT_COUNTRY = COUNTRIES[0]; // Bangladesh

/* ── PhoneInput component ── */

interface PhoneInputProps {
    id: string;
    label: string;
    required?: boolean;
    hint?: string;
    value: string;
    onChange: (fullE164: string) => void;
    error?: string;
    defaultCountryCode?: string;
}

/**
 * Combined country-code selector + number input.
 *
 * Stores and reports the full E.164 number (e.g. "+8801712345678").
 * Internally splits into { country, localNumber } so the user never
 * types the dial-code prefix.
 */
export default function PhoneInput({
    id,
    label,
    required = false,
    hint,
    value,
    onChange,
    error,
    defaultCountryCode,
}: PhoneInputProps) {
    /* Derive initial country + local number from the incoming E.164 value */
    const resolveInitial = useCallback((): {
        country: CountryOption;
        local: string;
    } => {
        if (!value) {
            const fallback =
                COUNTRIES.find((c) => c.code === defaultCountryCode) ??
                DEFAULT_COUNTRY;
            return { country: fallback, local: "" };
        }
        /* Try longest dial-code match first (e.g. +971 before +9) */
        const sorted = [...COUNTRIES].sort(
            (a, b) => b.dial.length - a.dial.length
        );
        for (const c of sorted) {
            if (value.startsWith(c.dial)) {
                return { country: c, local: value.slice(c.dial.length) };
            }
        }
        return { country: DEFAULT_COUNTRY, local: value.replace(/^\+/, "") };
    }, [value, defaultCountryCode]);

    const initial = resolveInitial();
    const [selectedCountry, setSelectedCountry] = useState<CountryOption>(
        initial.country
    );
    const [localNumber, setLocalNumber] = useState(initial.local);
    const [dropdownOpen, setDropdownOpen] = useState(false);
    const wrapperRef = useRef<HTMLDivElement>(null);
    const inputRef = useRef<HTMLInputElement>(null);

    /* Close dropdown on outside click */
    useEffect(() => {
        const handler = (e: MouseEvent) => {
            if (
                wrapperRef.current &&
                !wrapperRef.current.contains(e.target as Node)
            ) {
                setDropdownOpen(false);
            }
        };
        document.addEventListener("mousedown", handler);
        return () => document.removeEventListener("mousedown", handler);
    }, []);

    /* Sync outward whenever country or local changes */
    const emit = useCallback(
        (country: CountryOption, local: string) => {
            const digits = local.replace(/\D/g, "");
            onChange(digits ? `${country.dial}${digits}` : "");
        },
        [onChange]
    );

    const handleLocalChange = (raw: string) => {
        const digits = raw.replace(/\D/g, "");
        setLocalNumber(digits);
        emit(selectedCountry, digits);
    };

    const handleCountrySelect = (country: CountryOption) => {
        setSelectedCountry(country);
        setDropdownOpen(false);
        emit(country, localNumber);
        inputRef.current?.focus();
    };

    return (
        <div className="space-y-1.5" ref={wrapperRef}>
            <label
                htmlFor={id}
                className="text-sm font-medium leading-none peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
            >
                {label}
                {required ? " *" : ""}
                {hint ? (
                    <span className="ml-2 text-xs font-normal text-muted-foreground">
                        {hint}
                    </span>
                ) : null}
            </label>

            <div className="relative">
                <div
                    className={cn(
                        "flex h-9 w-full rounded-md border bg-transparent text-base shadow-xs transition-[color,box-shadow] md:text-sm",
                        error
                            ? "border-destructive ring-destructive/20"
                            : "border-input focus-within:border-ring focus-within:ring-[3px] focus-within:ring-ring/50"
                    )}
                >
                    {/* Country selector trigger */}
                    <button
                        type="button"
                        onClick={() => setDropdownOpen((prev) => !prev)}
                        className="flex shrink-0 items-center gap-1 rounded-l-md border-r border-input px-2.5 text-sm transition-colors hover:bg-muted/40 focus:outline-none"
                        aria-label="Select country code"
                        tabIndex={-1}
                    >
                        <span className="text-base leading-none">
                            {selectedCountry.flag}
                        </span>
                        <span className="text-xs text-muted-foreground">
                            {selectedCountry.dial}
                        </span>
                        <ChevronDown className="h-3 w-3 text-muted-foreground" />
                    </button>

                    {/* Number input */}
                    <input
                        ref={inputRef}
                        id={id}
                        type="tel"
                        inputMode="numeric"
                        placeholder="1XXXXXXXXX"
                        value={localNumber}
                        onChange={(e) => handleLocalChange(e.target.value)}
                        className="h-full w-full min-w-0 bg-transparent px-3 py-1 text-base outline-none placeholder:text-muted-foreground md:text-sm"
                    />
                </div>

                {/* Dropdown */}
                {dropdownOpen ? (
                    <div className="absolute left-0 top-full z-50 mt-1 max-h-56 w-64 overflow-y-auto rounded-md border border-border bg-popover p-1 shadow-lg animate-in fade-in-0 zoom-in-95">
                        {COUNTRIES.map((country) => (
                            <button
                                key={country.code}
                                type="button"
                                onClick={() => handleCountrySelect(country)}
                                className={cn(
                                    "flex w-full items-center gap-2.5 rounded-sm px-2.5 py-2 text-sm transition-colors hover:bg-accent hover:text-accent-foreground",
                                    selectedCountry.code === country.code &&
                                        "bg-accent/60 font-medium"
                                )}
                            >
                                <span className="text-base leading-none">
                                    {country.flag}
                                </span>
                                <span className="flex-1 text-left">
                                    {country.name}
                                </span>
                                <span className="text-xs text-muted-foreground">
                                    {country.dial}
                                </span>
                            </button>
                        ))}
                    </div>
                ) : null}
            </div>

            {error ? (
                <p className="text-sm text-destructive">{error}</p>
            ) : null}
        </div>
    );
}
