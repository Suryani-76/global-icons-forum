import { useRef, useState } from 'react'
import { motion, useInView } from 'framer-motion'

const CERTIFICATIONS = [
  'The Society is formed with no profit motive and no commercial activity is involved in its working.',
  'The Society does not engage in agitational activities to ventilate grievances.',
  'The Office bearers are not paid from the funds of the Society.',
  'The Office bearers\' signatures are genuine and duly verified.',
]

const RULES = [
  { title: 'Membership', content: 'Any Indian Citizen who has attained 18 years of age is entitled to membership. Annual subscription of ₹100 is payable at the beginning of every year. Non-payment within 3 months forfeits membership and voting rights.' },
  { title: 'General Body Meeting', content: 'The General Body meeting shall be conducted every year in the month of June. Special meetings may be called at any time of necessity. Quorum shall be 1/3rd of the total members.' },
  { title: 'Executive Body', content: 'Consists of a President, Vice-President, Secretary, Joint Secretary, Treasurer, and two Executive Members. The committee shall meet every three months. Quorum shall be 2/3rd of the members. Members are elected for a term of 3 years.' },
  { title: 'Funds Management', content: 'Funds are raised by donations, gifts and other offerings. All funds shall be deposited in an authorised chartered Bank. Bank accounts are operated jointly by the President and Treasurer. No portion of funds shall be paid to any member.' },
  { title: 'Audit & Financial Year', content: 'The accounts of the Society shall be audited by a qualified Chartered Accountant. The financial year of the Society shall be from April 1st to March 31st each year.' },
  { title: 'Amendments', content: 'No amendment shall be made unless voted by 3/5th of the members present and confirmed at a Second General Body Meeting by 3/5th of members present.' },
  { title: 'Disputes', content: 'Any disputes arising among the committee or members shall be resolved under the provisions of the APSR Act (Sec 23).' },
  { title: 'Winding Up & Dissolution', content: 'The Society may be dissolved by a resolution passed by 3/5th majority of the General Body under Sec. 35 of the Societies Registration Act 2001. Upon dissolution, assets are transferred to a similar organisation having similar aims and objects.' },
]

export default function LegalSection() {
  const sectionRef = useRef()
  const inView = useInView(sectionRef, { once: true, margin: '-80px' })
  const [openRule, setOpenRule] = useState(null)

  return (
    <div ref={sectionRef}>
      <section className="section" style={{ background: 'var(--color-bg-card)' }}>
        <div className="container">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ duration: 0.7 }} style={{ marginBottom: '3rem' }}>
            <span className="section-label">Legal & Governance</span>
            <h2 className="section-title">About Our <span className="text-orange">Society</span></h2>
            <div className="divider" />
            <p className="section-subtitle">Official information about the Global Icons Forum Society as registered under the Societies Registration Act 35/2001.</p>
          </motion.div>

          {/* Registration card */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.15 }}
            style={{ background: 'var(--color-bg-mid)', borderRadius: 16, border: '1px solid rgba(255,255,255,0.2)', padding: '2rem', marginBottom: '2.5rem', display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '1.5rem' }}>
            {[
              { label: 'Organisation Name', value: 'Global Icons Forum Society' },
              { label: 'Registration Act', value: 'Societies Registration Act 35/2001' },
              { label: 'Registered Office', value: 'D.No: 24-29-210A, Durgapuram, Gulabithota Road, Vijayawada, NTR District-520003, Andhra Pradesh' },
              { label: 'Nature', value: 'Non-Profit Organisation' },
              { label: 'Financial Year', value: 'April 1st — March 31st' },
              { label: 'Tax Eligibility', value: 'Section 11, 12A & 80G of Income Tax Act' },
            ].map((item, i) => (
              <div key={i} style={{ borderLeft: '3px solid rgba(255,255,255,0.6)', paddingLeft: '0.85rem' }}>
                <div style={{ fontSize: '0.72rem', fontWeight: 600, color: 'rgba(255,255,255,0.58)', textTransform: 'uppercase', letterSpacing: '0.08em', marginBottom: '0.2rem' }}>{item.label}</div>
                <div style={{ fontSize: '0.9rem', fontWeight: 600, color: '#ffffff', lineHeight: 1.4 }}>{item.value}</div>
              </div>
            ))}
          </motion.div>

          {/* Certifications */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.25 }} style={{ marginBottom: '2.5rem' }}>
            <h3 style={{ marginBottom: '1.25rem', color: '#ffffff', fontSize: '1.2rem' }}>Official Certifications</h3>
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '0.85rem' }}>
              {CERTIFICATIONS.map((cert, i) => (
                <div key={i} style={{ background: 'rgba(255,255,255,0.15)', borderRadius: 10, padding: '1rem 1.25rem', border: '1px solid #b8dff0', display: 'flex', gap: '0.75rem', alignItems: 'flex-start' }}>
                  <div style={{ width: 22, height: 22, borderRadius: '50%', background: '#0f7ea3', display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0, marginTop: 1 }}>
                    <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round"><polyline points="20 6 9 17 4 12" /></svg>
                  </div>
                  <p style={{ fontSize: '0.85rem', color: 'rgba(255,255,255,0.9)', lineHeight: 1.6, margin: 0 }}>{cert}</p>
                </div>
              ))}
            </div>
          </motion.div>

          {/* Rules accordion */}
          <motion.div initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}} transition={{ delay: 0.35 }}>
            <h3 style={{ marginBottom: '1.25rem', color: '#ffffff', fontSize: '1.2rem' }}>Rules & Regulations</h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
              {RULES.map((rule, i) => (
                <div key={i} style={{ background: 'var(--color-bg-card)', borderRadius: 10, border: '1px solid rgba(255,255,255,0.2)', overflow: 'hidden' }}>
                  <button onClick={() => setOpenRule(openRule === i ? null : i)}
                    style={{ width: '100%', padding: '1rem 1.25rem', display: 'flex', alignItems: 'center', justifyContent: 'space-between', background: 'none', border: 'none', cursor: 'pointer', fontFamily: 'var(--font-body)', fontWeight: 700, fontSize: '0.92rem', color: '#ffffff', textAlign: 'left' }}>
                    <span style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
                      <span style={{ width: 24, height: 24, borderRadius: '50%', background: 'rgba(255,255,255,0.15)', color: '#ffffff', fontSize: '0.72rem', fontWeight: 800, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>{i + 1}</span>
                      {rule.title}
                    </span>
                    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="#888" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round" style={{ transform: openRule === i ? 'rotate(180deg)' : 'none', transition: 'transform 0.3s ease', flexShrink: 0 }}>
                      <polyline points="6 9 12 15 18 9" />
                    </svg>
                  </button>
                  {openRule === i && (
                    <div style={{ padding: '0 1.25rem 1.25rem', borderTop: '1px solid #f0f0f0' }}>
                      <p style={{ fontSize: '0.875rem', color: 'rgba(255,255,255,0.78)', lineHeight: 1.75, margin: '0.75rem 0 0' }}>{rule.content}</p>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>
    </div>
  )
}
