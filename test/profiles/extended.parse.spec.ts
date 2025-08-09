import fs from 'node:fs';
import path from 'node:path';

import { FacturX } from '../../src/index';
import { isExtendedProfile } from '../../src/profiles/extended';

describe('Factur-X Extended Pre', () => {
    it('should parse the extended profile from PDF', async () => {
        const facturX = await FacturX.fromPDF(
            fs.readFileSync(path.join(__dirname, 'pdf', `EXTENDED_Kostenrechnung.pdf`))
        );
        const result = await facturX.getObject();
        expect(isExtendedProfile(result)).toBe(true);
        console.log('Parsed Extended Profile:', result);
    });
});
