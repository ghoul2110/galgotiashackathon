import { NextRequest, NextResponse } from 'next/server';
import { 
    getUserIdentifier, 
    SelfBackendVerifier, 
    countryCodes 
} from '@selfxyz/core';
import { kv } from '@vercel/kv';
import { SelfApp } from '@selfxyz/qrcode';

export async function POST(req: NextRequest) {
    try {
        const { proof, publicSignals } = await req.json();

        if (!proof || !publicSignals) {
            return NextResponse.json({ message: 'Proof and publicSignals are required' }, { status: 400 });
        }

        const userId = await getUserIdentifier(publicSignals);
        console.log("Extracted userId from verification result:", userId);

        // Default options
        let minimumAge;
        let excludedCountryList: string[] = [];
        let enableOfac = false;
        let enabledDisclosures = {
            issuing_state: false,
            name: false,
            nationality: false,
            date_of_birth: false,
            passport_number: false,
            gender: false,
            expiry_date: false
        };
        
        // Try to retrieve options from store using userId
        if (userId) {
            const savedOptions = await kv.get(userId) as SelfApp["disclosures"];
            if (savedOptions) {
                console.log("Saved options:", savedOptions);
                
                // Apply saved options
                minimumAge = savedOptions.minimumAge || minimumAge;
                
                if (savedOptions.excludedCountries && savedOptions.excludedCountries.length > 0) {
                    excludedCountryList = savedOptions.excludedCountries.map(
                        (code: string) => countryCodes[code as keyof typeof countryCodes] || code
                    );
                }
                
                enableOfac = savedOptions.ofac !== undefined ? savedOptions.ofac : enableOfac;
                
                // Apply all disclosure settings
                enabledDisclosures = {
                    issuing_state: savedOptions.issuing_state !== undefined ? savedOptions.issuing_state : enabledDisclosures.issuing_state,
                    name: savedOptions.name !== undefined ? savedOptions.name : enabledDisclosures.name,
                    nationality: savedOptions.nationality !== undefined ? savedOptions.nationality : enabledDisclosures.nationality,
                    date_of_birth: savedOptions.date_of_birth !== undefined ? savedOptions.date_of_birth : enabledDisclosures.date_of_birth,
                    passport_number: savedOptions.passport_number !== undefined ? savedOptions.passport_number : enabledDisclosures.passport_number,
                    gender: savedOptions.gender !== undefined ? savedOptions.gender : enabledDisclosures.gender,
                    expiry_date: savedOptions.expiry_date !== undefined ? savedOptions.expiry_date : enabledDisclosures.expiry_date
                };
            } else {
                console.log("No saved options found for userId:", userId);
            }
        } else {
            console.log("No userId found in verification result, using default options");
        }
        
        const configuredVerifier = new SelfBackendVerifier(
            'https://forno.celo.org',
            "VAVASASA",
            "hex", 
            true
        );
        
        if (minimumAge !== undefined) {
            configuredVerifier.setMinimumAge(minimumAge);
        }
        
        if (excludedCountryList.length > 0) {
            configuredVerifier.excludeCountries(
                ...excludedCountryList as (keyof typeof countryCodes)[]
            );
        }
        
        if (enableOfac) {
            configuredVerifier.enableNameAndDobOfacCheck();
        }

        const result = await configuredVerifier.verify(proof, publicSignals);
        console.log("Verification result:", result);

        if (result.isValid) {
            const filteredSubject = { ...result.credentialSubject };
            
            if (!enabledDisclosures.issuing_state && filteredSubject) {
                filteredSubject.issuing_state = "Not disclosed";
            }
            if (!enabledDisclosures.name && filteredSubject) {
                filteredSubject.name = "Not disclosed";
            }
            if (!enabledDisclosures.nationality && filteredSubject) {
                filteredSubject.nationality = "Not disclosed";
            }
            if (!enabledDisclosures.date_of_birth && filteredSubject) {
                filteredSubject.date_of_birth = "Not disclosed";
            }
            if (!enabledDisclosures.passport_number && filteredSubject) {
                filteredSubject.passport_number = "Not disclosed";
            }
            if (!enabledDisclosures.gender && filteredSubject) {
                filteredSubject.gender = "Not disclosed";
            }
            if (!enabledDisclosures.expiry_date && filteredSubject) {
                filteredSubject.expiry_date = "Not disclosed";
            }
            
            return NextResponse.json({
                status: 'success',
                result: result.isValid,
                credentialSubject: filteredSubject,
                verificationOptions: {
                    minimumAge,
                    ofac: enableOfac,
                    excludedCountries: excludedCountryList.map(countryName => {
                        const entry = Object.entries(countryCodes).find(([_, name]) => name === countryName);
                        return entry ? entry[0] : countryName;
                    })
                }
            });
        } else {
            return NextResponse.json({
                status: 'error', 
                result: result.isValid,
                message: 'Verification failed',
                details: result.isValidDetails
            }, { status: 400 });
        }
    } catch (error) {
        console.error('Error verifying proof:', error);
        return NextResponse.json({ 
            message: 'Error verifying proof',
            error: error instanceof Error ? error.message : 'Unknown error'
        }, { status: 500 });
    }
}