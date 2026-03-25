const fs = require('fs');
const path = require('path');

const csvPath = path.join(__dirname, 'data', 'importar_candidatos_final.csv');
const content = fs.readFileSync(csvPath, 'utf8');

const lines = content.trim().split('\n');
const updates = [];

for (let i = 1; i < lines.length; i++) {
    const line = lines[i];
    const matches = line.match(/(".*?"|[^",\s]+)(?=\s*,|\s*$)/g);
    
    if (!matches || matches.length < 9) continue;
    
    const name = matches[0].replace(/"/g, '').trim();
    const email = matches[1].replace(/"/g, '').trim();
    const phone = matches[2].replace(/"/g, '').trim();
    const linkedin = matches[3] ? matches[3].replace(/"/g, '').trim() : '';
    const position = matches[4] ? matches[4].replace(/"/g, '').trim() : '';
    const salary = matches[6] ? matches[6].replace(/"/g, '').trim() : '';
    const notes = matches[7] ? matches[7].replace(/"/g, '').trim() : '';
    const recruiter_email = matches[8] ? matches[8].replace(/"/g, '').trim() : '';

    if (email) {
        const structuredInfo = `
<h3>PROFESSIONAL PROFILE</h3>
<p><strong>Position:</strong> ${position}</p>
<p><strong>Experience & Notes:</strong> ${notes}</p>
<p><strong>Expected Salary:</strong> ${salary || 'Not specified'}</p>

<h3>CONTACT DETAILS</h3>
<p><strong>Email:</strong> ${email}</p>
<p><strong>Phone:</strong> ${phone}</p>
<p><strong>LinkedIn:</strong> <a href="${linkedin}">${linkedin}</a></p>

<h3>RECRUITMENT DATA</h3>
<p><strong>Recruiter:</strong> ${recruiter_email}</p>
<p><strong>Import Source:</strong> Importación CSV Final</p>
<hr />
`.trim().replace(/\n/g, '');

        updates.push(`UPDATE job_applications 
SET 
  position = COALESCE(position, '${position.replace(/'/g, "''")}'),
  expected_salary = COALESCE(expected_salary, '${salary.replace(/'/g, "''")}'),
  cover_letter = '${structuredInfo.replace(/'/g, "''")}',
  linkedin_url = COALESCE(linkedin_url, '${linkedin.replace(/'/g, "''")}'),
  phone = COALESCE(phone, '${phone.replace(/'/g, "''")}')
WHERE email = '${email.replace(/'/g, "''")}' AND (cover_letter IS NULL OR cover_letter = '');`);
    }
}

fs.writeFileSync('patch_candidates.sql', updates.join('\n'));
console.log(`Generated ${updates.length} updates in patch_candidates.sql`);
