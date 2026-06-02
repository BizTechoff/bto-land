/**
 * ============================================================
 * Malach HaZchuyot - Architecture Data (Single Source of Truth)
 * ============================================================
 *
 * This file holds ALL the data for the architecture viz.
 * Edit here to add/modify actors, operations, or links.
 *
 * Schema:
 *   tracks       - Top-level workflows (Intake / Execution / Admin)
 *   actors       - All entities involved (citizens, lawyers, modules)
 *   operations   - Atomic actions (single source of truth, referenced from many actors)
 *   entities     - DB tables / data models (DigitalTwin, RightModule, ClaimCase)
 *   methods      - Key technical methods (referenced from operations)
 *   connections  - Global graph of who-talks-to-whom
 *
 * To add a new operation:
 *   1. Add entry to operations { id, ... }
 *   2. Reference its id from actor.relatedOps
 *
 * ============================================================
 */

const ARCH_DATA = {

  /* ================================================================
     TRACKS
     ================================================================ */
  tracks: {
    intake: {
      id: 'intake',
      number: '01',
      name: 'קליטת בקשה חדשה',
      nameEn: 'Intake Track',
      color: 't1',
      desc: 'מהרגע שהאזרח שולח הודעה ראשונה ב-WhatsApp ועד שהבקשה מוכנה להגשה. כל ה-Intake, חילוץ הנתונים, וההתאמה מול הקטלוג.',
      lanes: [
        { type: 'user', label: 'המשתמש', actors: ['citizen'] },
        { type: 'external', label: 'גורמים חיצוניים', actors: ['whatsapp', 'llm', 'idf'] },
        { type: 'platform', label: 'מודולים בפלטפורמה', actors: ['ai-intake', 'vision', 'twin', 'catalog', 'eligibility'] }
      ],
      flow: [
        { step: '01', title: 'קבלת הודעה ראשונה', desc: 'אזרח שולח הודעה ב-WhatsApp ("היי, אני מילואימניק..."). הודעה נכנסת דרך ספק ה-WhatsApp ל-AI Intake.', ops: ['op_send_msg', 'op_receive_webhook', 'op_load_session'] },
        { step: '02', title: 'שיחה אדפטיבית · חילוץ נתונים', desc: 'ה-AI שואל שאלות מותאמות הקשר. כל תשובה מעדכנת את ה-Twin. אם המשתמש שולח צילום — Vision Extractor מחלץ נתונים מובנים.', ops: ['op_pick_question', 'op_call_llm', 'op_classify_doc', 'op_extract_doc', 'op_update_twin'] },
        { step: '03', title: 'אימות מסמכים מול מקורות חיצוניים', desc: 'תעודת מילואים — אימות תוקף מול פורטל צה"ל. אם פגה — האזרח מקבל הסבר איך לחדש.', ops: ['op_validate_doc', 'op_check_idf', 'op_request_renewal'] },
        { step: '04', title: 'הרצת התאמה מול קטלוג הזכויות', desc: 'ה-Twin המעודכן רץ מול כל המודולים בקטלוג. ה-Eligibility Engine מחזיר רשימת זכויות תואמות + סכומים משוערים.', ops: ['op_load_modules', 'op_run_predicates', 'op_compute_amount'] },
        { step: '05', title: 'סיכום והצעה לאזרח', desc: 'תוצאות מסונתזות לשפה טבעית: "מצאתי 2 זכויות בסך משוער של ₪650 לשנה. להגיש?". האזרח לוחץ "מאשר".', ops: ['op_synthesize_response', 'op_user_confirm', 'op_handoff_to_agent'] }
      ]
    },

    execution: {
      id: 'execution',
      number: '02',
      name: 'תפעול הבקשה',
      nameEn: 'Execution Track',
      color: 't2',
      desc: 'מהרגע שהבקשה הוגשה ועד למימוש. כל המעקב, השעונים, השגות, ערעורים, ומנגנון אישור־שתיקה.',
      lanes: [
        { type: 'user', label: 'המשתמש', actors: ['citizen'] },
        { type: 'external', label: 'גורמים חיצוניים', actors: ['municipality', 'appeal-cmt', 'lawyer-advisor', 'signing'] },
        { type: 'platform', label: 'מודולים בפלטפורמה', actors: ['adapters', 'claim-agent', 'queue', 'mailbox'] }
      ],
      flow: [
        { step: '01', title: 'הגשה לרשות', desc: 'Claim Agent יוצר תיק חדש במצב SUBMITTED. בוחר את ה-Adapter המתאים (ת"א / ירושלים / חיפה) ומבצע הגשה לרשות.', ops: ['op_create_claim', 'op_choose_adapter', 'op_submit_to_authority'] },
        { step: '02', title: 'הפעלת שעון אישור־שתיקה', desc: 'BullMQ יוצר job עם delay של 60 יום. המצב משתנה ל-FOLLOWUP. אזרח מקבל הודעה: "הוגש. אעדכן אותך."', ops: ['op_start_silent_clock', 'op_notify_user_submitted'] },
        { step: '03', title: 'מעקב פעיל · 60 יום', desc: 'כל 14 יום: בדיקת סטטוס בפורטל הרשות (Polling). מקביל: Inbound Mailbox מאזין למייל מהרשות.', ops: ['op_poll_status', 'op_receive_authority_email', 'op_update_claim_state'] },
        { step: '04A', title: 'תרחיש: הרשות אישרה', desc: 'תגובה חיובית התקבלה. המצב משתנה ל-APPROVED. אזרח מקבל הודעה עם מספר אסמכתא וסכום ההנחה.', ops: ['op_mark_approved', 'op_notify_user_success'] },
        { step: '04B', title: 'תרחיש: הרשות שתקה', desc: 'אחרי 60 יום, ה-job מתעורר. נשלח מכתב רשמי לרשות לפי תקנה 3ו(ה). זכייה אוטומטית.', ops: ['op_silent_approval_triggered', 'op_send_silent_letter'] },
        { step: '04C', title: 'תרחיש: הרשות דחתה', desc: 'Claude מנתח את עילת הדחייה. אם ניתן ערר אוטונומי — מוכן כתב ערר, נשלח לעו"ד הליווי דרך שירות החתימה.', ops: ['op_analyze_rejection', 'op_prepare_appeal', 'op_lawyer_sign_appeal', 'op_submit_appeal'] }
      ]
    },

    admin: {
      id: 'admin',
      number: '03',
      name: 'תצוגת ניהול',
      nameEn: 'Admin Track',
      color: 't3',
      desc: 'פאנל ה-Admin שמציג את המצב הנוכחי בכל רגע נתון — תיקים, חתימות, סטטיסטיקות, ויד אנושית במקרה הצורך.',
      lanes: [
        { type: 'user', label: 'משתמשים פנימיים', actors: ['operator', 'founder', 'dpo'] },
        { type: 'external', label: 'גורמים חיצוניים', actors: ['senior-lawyer', 'privacy-authority'] },
        { type: 'platform', label: 'מודולים בפלטפורמה', actors: ['admin-panel', 'auth-mod', 'audit-log', 'dashboards'] }
      ],
      flow: [
        { step: '01', title: 'תצוגת תיקים פעילים', desc: 'טבלה של כל התיקים הפתוחים, מסוננים לפי סטטוס. כל תיק מציג שם אזרח (מוסתר חלקית), עיר, מודול, וזמן עד דדליין הבא.', ops: ['op_login_admin', 'op_view_active_cases', 'op_filter_cases'] },
        { step: '02', title: 'ניהול מודולי זכויות', desc: 'יצירה ועריכה של מודולים חדשים. שליחת מודול לחתימת עו"ד. קבלה אוטומטית של PDF חתום.', ops: ['op_create_module', 'op_edit_module', 'op_send_for_signature', 'op_receive_signed_pdf'] },
        { step: '03', title: 'תיקים שדורשים יד אנושית', desc: 'תור נפרד של תיקים במצב HUMAN_LAWYER_REQUIRED. Operator מקבל התראה ופותח את התיק.', ops: ['op_human_required_alert', 'op_assign_to_lawyer', 'op_pause_silent_clock'] },
        { step: '04', title: 'סטטיסטיקות וביצועים', desc: 'Dashboards חיים: תיקים פעילים, אחוז הצלחה לכל עיר, זמן ממוצע למימוש, סכום מצטבר שהושג ללקוחות.', ops: ['op_view_dashboards', 'op_export_report'] },
        { step: '05', title: 'פיקוח פרטיות וציות', desc: 'DPO ניגש ל-Audit Log ובודק רישומי גישה. במקרה של בקשת מחיקה — מבצע ע"י Admin Panel.', ops: ['op_register_data_archive', 'op_audit_access', 'op_user_deletion_request', 'op_periodic_dpo_report'] }
      ]
    }
  },

  /* ================================================================
     ACTORS - all 26 entities
     ================================================================ */
  actors: {

    /* === USER LANE === */
    citizen: {
      name: 'אזרח',
      nameEn: 'Citizen',
      tag: 'END USER',
      layer: 'user',
      desc: 'מבקש הזכות. מספק פרטים, מעלה מסמכים, ומאשר הגשה.',
      interfaces: ['WhatsApp בלבד', 'בעברית', '24/7'],
      relatedOps: ['op_send_msg', 'op_user_confirm', 'op_notify_user_submitted', 'op_notify_user_success', 'op_user_deletion_request'],
      relatedEntities: ['DigitalTwin', 'ClaimCase'],
      notes: 'ה-Twin שלו מתעדכן בכל שיחה. כל פעולה מתועדת ב-Audit Log. רשאי למחוק את כל נתוניו בכל זמן.'
    },

    operator: {
      name: 'Operator',
      nameEn: 'Junior Lawyer',
      tag: 'INTERNAL',
      layer: 'user',
      desc: 'משפטן זוטר שמנהל את המערכת מבפנים — יוצר מודולים, מטפל במקרים חריגים.',
      interfaces: ['Admin Panel (Angular SPA)', 'גישה אחרי 2FA', 'דומיין ניהול נפרד'],
      relatedOps: ['op_login_admin', 'op_view_active_cases', 'op_create_module', 'op_edit_module', 'op_send_for_signature', 'op_human_required_alert', 'op_assign_to_lawyer'],
      relatedEntities: ['RightModule', 'ClaimCase', 'AuditLog'],
      notes: 'בעל הסמכות הבכירה במערכת לאחר בעל המוצר. גישה מלאה לאודיט.'
    },

    founder: {
      name: 'בעל המוצר',
      nameEn: 'Product Owner',
      tag: 'INTERNAL',
      layer: 'user',
      desc: 'הבעלים העסקי של הפלטפורמה. רואה את התמונה הרחבה.',
      interfaces: ['Admin Panel · גישת בעלים', 'Dashboards מסונתזים בלבד'],
      relatedOps: ['op_view_dashboards', 'op_export_report'],
      relatedEntities: ['Dashboards'],
      notes: 'אין גישה לנתונים אישיים של אזרחים אלא דרך DPO. רואה רק נתונים אגרגטיביים.'
    },

    dpo: {
      name: 'DPO',
      nameEn: 'Data Protection Officer',
      tag: 'INTERNAL',
      layer: 'user',
      desc: 'אחראי על ציות לתקנות הפרטיות. עצמאי משאר ההנהלה.',
      interfaces: ['Admin Panel · גישת DPO', 'Audit Log מלא'],
      relatedOps: ['op_audit_access', 'op_user_deletion_request', 'op_periodic_dpo_report', 'op_register_data_archive'],
      relatedEntities: ['AuditLog', 'DigitalTwin'],
      notes: 'יכול להיות חיצוני (יועץ פרטיות במשרת חלקית) או פנימי. עלות: ₪2,000-4,000 לחודש.'
    },

    /* === EXTERNAL LANE === */
    whatsapp: {
      name: 'ספק WhatsApp',
      nameEn: 'WhatsApp Provider',
      tag: 'CHANNEL',
      layer: 'external',
      desc: 'ערוץ ההודעות בין האזרח למערכת. מספק webhook להודעות נכנסות ו-API להודעות יוצאות.',
      interfaces: ['Webhook על הודעות נכנסות', 'REST API להודעות יוצאות', 'תמיכה בקבצים: PDF, JPG, PNG'],
      relatedOps: ['op_send_msg', 'op_receive_webhook'],
      relatedEntities: [],
      notes: 'בשלב הראשון - ספק לא־רשמי. בעתיד מעבר ל-360dialog (BSP רשמי) לאחר אימות מול Meta.'
    },

    llm: {
      name: 'שירות LLM',
      nameEn: 'Claude API',
      tag: 'AI SERVICE',
      layer: 'external',
      desc: 'מנוע ה-AI שמבין שיחה, חולץ נתונים, ומסנתז תשובות. רץ במהלך שיחות ובניתוח דחיות.',
      interfaces: ['REST API', 'JSON Schema לחילוץ', 'תשלום לפי טוקנים'],
      relatedOps: ['op_call_llm', 'op_classify_doc', 'op_extract_doc', 'op_synthesize_response', 'op_analyze_rejection', 'op_prepare_appeal'],
      relatedEntities: [],
      notes: 'תמחור: $5 למיליון טוקנים בקלט, $20 למיליון בפלט. אינו שומר נתונים בין קריאות.'
    },

    idf: {
      name: 'פורטל המילואים',
      nameEn: 'IDF Miluim Portal',
      tag: 'SOURCE',
      layer: 'external',
      desc: 'מקור הסמכות לתעודות מילואים פעיל. אימות תוקף.',
      interfaces: ['ממשק הזדהות לאזרח', 'הוצאת תעודה דיגיטלית'],
      relatedOps: ['op_check_idf', 'op_request_renewal'],
      relatedEntities: [],
      notes: 'בשלב הראשון - האזרח מוציא תעודה ידנית ומעלה. בעתיד - אינטגרציה ישירה אם תיפתח.'
    },

    municipality: {
      name: 'רשות מקומית',
      nameEn: 'Municipality',
      tag: 'AUTHORITY',
      layer: 'external',
      desc: 'הגוף שאליו מוגשת ההשגה. ממנה מתקבלת תגובה (אישור / דחייה / בקשה למסמך).',
      interfaces: ['פורטל מקוון (ת"א)', 'מייל רשמי', 'דואר רשום'],
      relatedOps: ['op_submit_to_authority', 'op_poll_status', 'op_receive_authority_email', 'op_send_silent_letter'],
      relatedEntities: ['ClaimCase'],
      notes: 'אם לא ענתה תוך 60 יום - מנגנון אישור־שתיקה מופעל לפי תקנה 3ו(ה).'
    },

    'appeal-cmt': {
      name: 'ועדת ערר',
      nameEn: 'Appeal Committee',
      tag: 'AUTHORITY',
      layer: 'external',
      desc: 'ערכאה מנהלית מקבילה לעירייה. דנה בעררים נגד החלטות מנהל הארנונה.',
      interfaces: ['קבלת כתב ערר בכתב', 'דיון פורמלי', 'מתן החלטה'],
      relatedOps: ['op_submit_appeal'],
      relatedEntities: ['ClaimCase'],
      notes: 'אין מנגנון אישור־שתיקה לוועדה. החלטתה ניתנת לערעור בבית משפט מינהלי תוך 30 יום.'
    },

    'lawyer-advisor': {
      name: 'עו"ד הליווי',
      nameEn: 'Advisor Lawyer',
      tag: 'PROFESSIONAL',
      layer: 'external',
      desc: 'עו"ד שמלווה את הפלטפורמה ומאשר ניסוחי ערעורים.',
      interfaces: ['קבלת מסמכים דרך שירות חתימה', 'אישור או תיקון ניסוח'],
      relatedOps: ['op_lawyer_sign_appeal'],
      relatedEntities: ['ClaimCase'],
      notes: 'שכר טרחה: ₪150-300 לערר. לא נחשב לייצוג משפטי - רק אישור ניסוח.'
    },

    signing: {
      name: 'שירות חתימה',
      nameEn: 'eSign Service',
      tag: 'SERVICE',
      layer: 'external',
      desc: 'מנהל את תהליך החתימות הדיגיטליות לפי חוק חתימה אלקטרונית.',
      interfaces: ['REST API', 'webhook על השלמת חתימה', 'אחסון PDF חתומים'],
      relatedOps: ['op_send_for_signature', 'op_receive_signed_pdf', 'op_lawyer_sign_appeal'],
      relatedEntities: ['RightModule'],
      notes: 'תמחור לפי הספק שייבחר. אופציות: Zoho Sign, DocuSign, או חלופות ישראליות.'
    },

    'senior-lawyer': {
      name: 'עו"ד מוסמך',
      nameEn: 'Module Signer',
      tag: 'PROFESSIONAL',
      layer: 'external',
      desc: 'חותם דיגיטלית על מודולי זכויות לפני שהם הופכים LIVE.',
      interfaces: ['שירות חתימה דיגיטלית', 'מייל'],
      relatedOps: ['op_send_for_signature', 'op_receive_signed_pdf'],
      relatedEntities: ['RightModule'],
      notes: 'נדרשת חתימה חדשה לכל גרסה. שכר טרחה: ₪2,500-5,000 חד״פ למודול.'
    },

    'privacy-authority': {
      name: 'רשות הפרטיות',
      nameEn: 'Privacy Authority',
      tag: 'REGULATOR',
      layer: 'external',
      desc: 'רגולטור הפרטיות במשרד המשפטים. מפקח על מאגרי מידע.',
      interfaces: ['רישום מאגר מידע', 'דוחות תקופתיים', 'ביקורות'],
      relatedOps: ['op_register_data_archive', 'op_periodic_dpo_report'],
      relatedEntities: [],
      notes: 'רישום ראשוני וחידוש שנתי. מספר המאגר חייב להופיע במדיניות הפרטיות.'
    },

    /* === PLATFORM LANE === */
    'ai-intake': {
      name: 'AI Intake',
      nameEn: 'Conversation Layer',
      tag: 'MODULE 01',
      layer: 'platform',
      desc: 'הדלת הקדמית. מנהל שיחות, חולץ נתונים, ומחבר בין כל המודולים האחרים.',
      interfaces: ['Webhook listener', 'Session manager (Redis)', 'API ל-Claude', 'הזנת Twin'],
      relatedOps: ['op_receive_webhook', 'op_load_session', 'op_pick_question', 'op_call_llm', 'op_synthesize_response'],
      relatedEntities: ['ConversationSession', 'DigitalTwin'],
      relatedMethods: ['IntakeController.processMessage', 'IntakeController.nextQuestion'],
      notes: 'Session TTL: 24 שעות. אם משתמש חוזר אחרי 24 שעות - שיחה חדשה אבל Twin שמור.'
    },

    vision: {
      name: 'Vision Extractor',
      nameEn: 'Document Reader',
      tag: 'SUB-MODULE',
      layer: 'platform',
      desc: 'מחלץ נתונים מובנים מצילומי מסמכים (תעודות, חשבונות).',
      interfaces: ['קלט: תמונה (JPG/PNG/PDF)', 'פלט: JSON תואם schema'],
      relatedOps: ['op_classify_doc', 'op_extract_doc', 'op_validate_doc'],
      relatedEntities: ['DigitalTwin'],
      relatedMethods: ['VisionService.extractFromImage', 'VisionService.validateExtracted'],
      notes: 'משתמש ב-Claude Vision. במקרה של אי-וודאות - מבקש אישור מפורש מהאזרח.'
    },

    twin: {
      name: 'Digital Twin',
      nameEn: 'User Profile',
      tag: 'MODULE 02',
      layer: 'platform',
      desc: 'ייצוג דיגיטלי מובנה של האזרח. מתעדכן בכל שיחה ומשמש בסיס לכל החישובים.',
      interfaces: ['PostgreSQL Entity (Remult)', 'JSONB לשדות מקוננים', 'Event log'],
      relatedOps: ['op_update_twin'],
      relatedEntities: ['DigitalTwin'],
      relatedMethods: ['TwinController.updateField', 'TwinController.getTwin'],
      notes: 'מוצפן at-rest. גישה דרך JWT + RBAC. כל שינוי נשמר ב-event log.'
    },

    catalog: {
      name: 'Rights Catalog',
      nameEn: 'Signed Modules',
      tag: 'MODULE 03',
      layer: 'platform',
      desc: 'מאגר מודולי הזכויות החתומים. גרסאות מנוהלות עם semantic versioning.',
      interfaces: ['PostgreSQL + S3 (PDF חתום)', 'API לקריאה'],
      relatedOps: ['op_load_modules', 'op_create_module', 'op_edit_module', 'op_send_for_signature', 'op_receive_signed_pdf'],
      relatedEntities: ['RightModule', 'RightVersion'],
      relatedMethods: ['CatalogController.getModule', 'CatalogController.publishModule'],
      notes: 'בשלב הראשון - 2 מודולים: ארנונה למילואים, ארנונה לאזרחים ותיקים.'
    },

    eligibility: {
      name: 'Eligibility Engine',
      nameEn: 'Matching Logic',
      tag: 'MODULE 04',
      layer: 'platform',
      desc: 'מריץ Twin × Catalog ומחזיר רשימת זכויות זכאיות + סכומים.',
      interfaces: ['פונקציה pure (אין state)', 'קלט: Twin + Module', 'פלט: EvalResult'],
      relatedOps: ['op_run_predicates', 'op_compute_amount'],
      relatedEntities: ['DigitalTwin', 'RightModule'],
      relatedMethods: ['EligibilityController.evaluate', 'EligibilityController.classify'],
      notes: 'ביצועים: פחות מ-50ms לכל זכות. אין קריאות LLM - חישוב מקומי.'
    },

    adapters: {
      name: 'Authority Adapters',
      nameEn: '3 City Connectors',
      tag: 'MODULE 05',
      layer: 'platform',
      desc: 'חיבורים ייעודיים לכל רשות מקומית. כל אחד יודע את הפורמט והפרוטוקול הנכונים.',
      interfaces: ['Interface אחיד: submit / pollStatus / respondTo', '3 adapters: ת"א, ירושלים, חיפה'],
      relatedOps: ['op_choose_adapter', 'op_submit_to_authority', 'op_poll_status', 'op_send_silent_letter', 'op_submit_appeal'],
      relatedEntities: ['ClaimCase'],
      relatedMethods: ['AuthorityAdapter.submit', 'AuthorityAdapter.pollStatus'],
      notes: 'כל Adapter מודול נפרד שניתן לעדכן ללא נגיעה בליבה. ת"א משתמש ב-browser automation, ירושלים במייל.'
    },

    'claim-agent': {
      name: 'Claim Agent',
      nameEn: 'State Machine',
      tag: 'MODULE 06',
      layer: 'platform',
      desc: 'הסוכן הנודניק שמטפל בכל תיק לאורך זמן. מנהל מצבים ושעונים.',
      interfaces: ['BullMQ jobs', 'State Machine', 'קישור ל-Adapters ול-Twin'],
      relatedOps: ['op_handoff_to_agent', 'op_create_claim', 'op_start_silent_clock', 'op_update_claim_state', 'op_mark_approved', 'op_silent_approval_triggered', 'op_analyze_rejection', 'op_prepare_appeal', 'op_pause_silent_clock'],
      relatedEntities: ['ClaimCase', 'ClaimEvent'],
      relatedMethods: ['ClaimController.createClaim', 'ClaimController.transitionTo', 'ClaimController.onClaimEvent'],
      notes: '17 מצבים אפשריים בתוך State Machine. מצבי הערעור הוספו בגרסה האחרונה.'
    },

    queue: {
      name: 'Queue Manager',
      nameEn: 'BullMQ + Redis',
      tag: 'INFRA',
      layer: 'platform',
      desc: 'מנהל את כל ה-jobs המתוזמנים: שעון אישור־שתיקה, polling, התראות.',
      interfaces: ['Redis backend', 'BullMQ API', 'Persistent jobs'],
      relatedOps: ['op_start_silent_clock', 'op_silent_approval_triggered', 'op_poll_status'],
      relatedEntities: [],
      relatedMethods: ['SilentApprovalQueue.add', 'SilentApprovalQueue.process'],
      notes: 'תור נפרד לכל רשות כדי לא להציף ולקבל חסימה. Jobs שורדים נפילת שרת.'
    },

    mailbox: {
      name: 'Inbound Mailbox',
      nameEn: 'Reply Handler',
      tag: 'CHANNEL',
      layer: 'platform',
      desc: 'מאזין למיילים נכנסים מרשויות. כל תיק מקבל כתובת ייחודית.',
      interfaces: ['Webhook ממיילים נכנסים', 'pattern: claim+{id}@malach-hazchuyot.co.il'],
      relatedOps: ['op_receive_authority_email'],
      relatedEntities: ['ClaimCase'],
      relatedMethods: ['MailboxHandler.onInboundMail', 'MailboxHandler.classifyEmail'],
      notes: 'משתמש בספק כמו Postmark / MailGun. תגובה תוך דקות מקבלת המייל.'
    },

    'admin-panel': {
      name: 'Admin Panel',
      nameEn: 'Angular SPA',
      tag: 'MODULE 07',
      layer: 'platform',
      desc: 'Angular SPA נפרד מהאתר הציבורי. גישה רק עם 2FA.',
      interfaces: ['Angular RTL', 'דומיין: admin.malach-hazchuyot.co.il', 'JWT + 2FA'],
      relatedOps: ['op_login_admin', 'op_view_active_cases', 'op_filter_cases', 'op_create_module', 'op_edit_module', 'op_human_required_alert', 'op_assign_to_lawyer', 'op_view_dashboards', 'op_export_report'],
      relatedEntities: ['User', 'AuditLog'],
      relatedMethods: [],
      notes: 'כל פעולה נרשמת ב-Audit Log עם user, timestamp, IP, ופעולה.'
    },

    'auth-mod': {
      name: 'Auth Module',
      nameEn: 'JWT + 2FA',
      tag: 'INFRA',
      layer: 'platform',
      desc: 'אבטחת גישה. מודול קיים שכבר נבנה ב-BizTechoff.',
      interfaces: ['HttpOnly cookies', 'Refresh tokens', '2FA via SMS/TOTP'],
      relatedOps: ['op_login_admin'],
      relatedEntities: ['User'],
      relatedMethods: ['AuthController.login', 'AuthController.refresh'],
      notes: 'מודול גנרי שמשמש את כל מערכות BizTechoff. תומך multi-tenant.'
    },

    'audit-log': {
      name: 'Audit Log',
      nameEn: 'Access Tracking',
      tag: 'INFRA',
      layer: 'platform',
      desc: 'תיעוד כל גישה לנתוני אזרחים. חובה לפי תקנות אבטחת מידע.',
      interfaces: ['PostgreSQL append-only table', 'אין מחיקה'],
      relatedOps: ['op_audit_access', 'op_periodic_dpo_report'],
      relatedEntities: ['AuditLog'],
      relatedMethods: ['AuditService.logAccess', 'AuditService.report'],
      notes: 'נתונים נשמרים לפי החוק (לפחות 24 חודשים). DPO רשאי לגשת.'
    },

    dashboards: {
      name: 'Dashboards',
      nameEn: 'Live Metrics',
      tag: 'VIEW',
      layer: 'platform',
      desc: 'הצגת KPIs בזמן אמת לבעל המוצר.',
      interfaces: ['Angular Dashboard', 'נתונים אגרגטיביים בלבד'],
      relatedOps: ['op_view_dashboards', 'op_export_report'],
      relatedEntities: [],
      relatedMethods: ['DashboardService.getKPIs'],
      notes: 'אין חשיפה של פרטי אזרחים ספציפיים אלא דרך הרשאות מתאימות.'
    }
  },

  /* ================================================================
     OPERATIONS - 53 atomic operations (single source of truth)
     ================================================================ */
  operations: {

    /* === Track 01 · Intake === */
    op_send_msg: {
      title: 'שליחת הודעה ב-WhatsApp',
      what: 'אזרח שולח הודעה ראשונה — "היי, שמעתי שמגיעה לי הנחה" — דרך וואטסאפ. זה הצעד הראשון של כל מסע. אין צורך באפליקציה, ברישום, או בכל פעולה מוקדמת.',
      when: 'ביוזמת האזרח, בכל שעה ובכל יום.',
      how: 'האזרח כותב הודעה למספר העסקי של מלאך הזכויות (כמו לכל איש קשר רגיל) ושולח. ההודעה מועברת מיידית מהשרתים של ספק WhatsApp לפלטפורמה דרך webhook.',
      who: ['citizen', 'whatsapp'],
      relatedEntity: null,
      relatedMethod: null
    },

    op_receive_webhook: {
      title: 'קליטת הודעה במערכת',
      what: 'הפלטפורמה מקבלת את ההודעה מספק WhatsApp. בודקת אם זה משתמש ותיק או חדש, וטוענת את ה-Session המתאים.',
      when: 'תוך שניות מרגע ששלחה לאזרח.',
      how: 'ספק WhatsApp שולח HTTP POST ל-endpoint הציבורי שלנו. ה-AI Intake מקבל את ההודעה, מזהה את שולח ההודעה לפי מספר הטלפון, וטוען נתונים מ-Redis.',
      who: ['whatsapp', 'ai-intake'],
      relatedEntity: 'ConversationSession',
      relatedMethod: 'IntakeController.processMessage'
    },

    op_load_session: {
      title: 'טעינת היסטוריית שיחה',
      what: 'אם האזרח כבר התחיל שיחה קודמת — נטענים הנתונים שהספיק לתת. אם זה הראשון פעם — נוצרת רשומה חדשה.',
      when: 'עם כל הודעה שמתקבלת.',
      how: 'Redis מאחסן את ה-Session עם מפתח של מספר הטלפון. TTL: 24 שעות. אחרי 24 שעות שיחה חדשה מתחילה אבל ה-Twin כבר נשמר ב-PostgreSQL.',
      who: ['ai-intake'],
      relatedEntity: 'ConversationSession',
      relatedMethod: null
    },

    op_pick_question: {
      title: 'בחירת השאלה הבאה',
      what: 'ה-AI מחליט מה לשאול את האזרח עכשיו. הוא לא שואל רשימה קבועה — אלא מסתכל מה כבר יודעים על האזרח, ובוחר את השאלה הכי קריטית שחסרה.',
      when: 'אחרי כל תשובה של האזרח, לפני שמשיבים לו.',
      how: 'בודקים את ה-Twin הקיים — אילו שדות מאוכלסים? אילו לא? אם חסר "סטטוס מילואים" - שואלים על זה. אם הכל יש - לא שואלים יותר ועוברים להרצת התאמה.',
      who: ['ai-intake'],
      relatedEntity: 'DigitalTwin',
      relatedMethod: 'IntakeController.nextQuestion'
    },

    op_call_llm: {
      title: 'קריאה לשירות AI',
      what: 'הפלטפורמה שולחת ל-Claude את כל היסטוריית השיחה ומבקשת ממנו את התשובה הבאה. לכן ה-AI נשמע טבעי - הוא רואה את כל מה שנאמר עד כה.',
      when: 'בכל שאלה לאזרח, בכל סינתזה של תשובה, בכל ניתוח של דחייה.',
      how: 'API call ל-Claude עם system prompt קבוע + היסטוריית השיחה + השדות החסרים ב-Twin. ה-LLM מחזיר טקסט טבעי בעברית או JSON מובנה לפי הצורך.',
      who: ['ai-intake', 'llm'],
      relatedEntity: null,
      relatedMethod: null
    },

    op_classify_doc: {
      title: 'זיהוי סוג מסמך',
      what: 'כשאזרח שולח צילום, ה-AI קודם מזהה במה מדובר: תעודת מילואים? חשבון ארנונה? תעודת ת.ז? לפי הזיהוי - יודעים מה לחלץ.',
      when: 'מיד אחרי קבלת קובץ.',
      how: 'קריאה ראשונה ל-Claude Vision עם השאלה: "איזה סוג מסמך זה?". התשובה ממיינת ל-schema הנכון לחילוץ בשלב הבא.',
      who: ['vision', 'llm'],
      relatedEntity: null,
      relatedMethod: 'VisionService.extractFromImage'
    },

    op_extract_doc: {
      title: 'חילוץ נתונים מהמסמך',
      what: 'ברגע שיודעים שזו תעודת מילואים, ה-AI מחלץ ממנה את כל השדות: מספר ת.ז, שם, תאריך תוקף, מספר אישי. החילוץ הוא מובנה - JSON, לא טקסט חופשי.',
      when: 'מיד אחרי זיהוי סוג המסמך.',
      how: 'קריאה שנייה ל-Claude Vision עם schema מוגדר. ה-LLM מחזיר JSON תואם, וצוות ולידציה אוטומטי בודק שהשדות הגיוניים.',
      who: ['vision', 'llm'],
      relatedEntity: 'DigitalTwin',
      relatedMethod: 'VisionService.extractFromImage'
    },

    op_validate_doc: {
      title: 'אימות הנתונים שחולצו',
      what: 'בודקים שהנתונים שחולצו תקינים: ת.ז עם ספרת ביקורת חוקית, תאריכים בפורמט נכון, שדות חובה לא ריקים. אם משהו חסר או חשוד - מבקשים מהאזרח לאשר או לצלם שוב.',
      when: 'מיד אחרי החילוץ.',
      how: 'בדיקות אוטומטיות (חוקיות ת.ז) + בדיקת תוקף (תאריך התעודה לא פג) + הצלבה עם נתונים שכבר קיימים ב-Twin.',
      who: ['vision'],
      relatedEntity: 'DigitalTwin',
      relatedMethod: 'VisionService.validateExtracted'
    },

    op_check_idf: {
      title: 'אימות תוקף תעודת מילואים',
      what: 'אם האזרח שלח תעודת מילואים, בודקים שהיא בתוקף לפי הנתונים שעליה (אין צורך בחיבור ישיר לצה"ל - התעודה עצמה כוללת תאריך תפוגה).',
      when: 'בעת חילוץ הנתונים מהתעודה.',
      how: 'השוואת תאריך התפוגה שעל התעודה לתאריך היום. בעתיד - אם תיפתח אינטגרציה לפורטל המילואים, נוסיף בדיקה ישירה.',
      who: ['vision', 'idf'],
      relatedEntity: null,
      relatedMethod: null
    },

    op_request_renewal: {
      title: 'בקשה לחידוש תעודה',
      what: 'אם תעודת המילואים פגה, ה-AI מסביר לאזרח איך להוציא אחת חדשה ב-2 דקות מהפורטל של צה"ל ושולח לו את הקישור הישיר.',
      when: 'כשמתגלה תעודה פגה.',
      how: 'הודעת WhatsApp עם קישור ישיר לפורטל המילואים + הסבר תמציתי איך להוציא תעודה.',
      who: ['ai-intake', 'citizen'],
      relatedEntity: null,
      relatedMethod: null
    },

    op_update_twin: {
      title: 'עדכון פרופיל האזרח',
      what: 'כל פיסת מידע שנאספה — מהשיחה, מהמסמכים, מהאישורים — נשמרת בפרופיל הדיגיטלי של האזרח. הפרופיל הזה הוא הבסיס לכל החישובים הבאים.',
      when: 'בכל שלב של השיחה שבו מתקבל מידע חדש.',
      how: 'עדכון רשומה ב-PostgreSQL דרך Remult. כל שינוי נשמר גם ב-event log כדי שאפשר יהיה לחזור אחורה ולראות מה היה מצב הפרופיל בכל רגע נתון.',
      who: ['ai-intake', 'twin'],
      relatedEntity: 'DigitalTwin',
      relatedMethod: 'TwinController.updateField'
    },

    op_load_modules: {
      title: 'טעינת קטלוג הזכויות',
      what: 'הפלטפורמה טוענת את כל מודולי הזכויות הפעילים מהקטלוג — נכון להיום זה ארנונה למילואים וארנונה לאזרחים ותיקים.',
      when: 'לפני הרצת בדיקת זכאות.',
      how: 'שליפה מ-PostgreSQL של כל המודולים במצב LIVE. כל מודול כולל את ה-Predicates (תנאי הזכאות) ואת נוסחת החישוב.',
      who: ['catalog', 'eligibility'],
      relatedEntity: 'RightModule',
      relatedMethod: 'CatalogController.getModule'
    },

    op_run_predicates: {
      title: 'הרצת תנאי זכאות',
      what: 'ה-Eligibility Engine לוקח את הפרופיל של האזרח ובודק לכל מודול זכות אם הוא עומד בכל התנאים. מילואימניק? כן. גר בתל אביב? כן. שוכר? כן. אם הכל עבר — הוא זכאי.',
      when: 'אחרי שהפרופיל מאוכלס מספיק.',
      how: 'פונקציה pure שמקבלת Twin + Module ומחזירה תוצאה: PASS / FAIL / MISSING. אם MISSING - מסומן בדיוק איזה שדה חסר.',
      who: ['eligibility'],
      relatedEntity: 'DigitalTwin',
      relatedMethod: 'EligibilityController.evaluate'
    },

    op_compute_amount: {
      title: 'חישוב סכום ההנחה',
      what: 'אם האזרח זכאי, מחשבים כמה זה שווה לו בכסף. למשל: 5% הנחה על חשבון ארנונה של ₪9,000 = ₪450 לשנה.',
      when: 'אחרי שהזכאות אושרה.',
      how: 'נוסחת החישוב מוגדרת בתוך המודול. אם יש Policy Override לעיר ספציפית (ת"א נותנת 5%, אבל עיר אחרת רק 3%) - הוא מתחשב בזה.',
      who: ['eligibility'],
      relatedEntity: 'RightModule',
      relatedMethod: 'EligibilityController.evaluate'
    },

    op_synthesize_response: {
      title: 'סינתזת תשובה טבעית',
      what: 'במקום להציג לאזרח JSON של זכויות, ה-AI מנסח תשובה אנושית: "מצאתי שני זכויות שמגיעות לך בסך משוער של ₪650 לשנה. רוצה שאתחיל להגיש?".',
      when: 'אחרי הרצת בדיקת הזכאות.',
      how: 'קריאה ל-Claude עם רשימת הזכויות שנמצאו והסכומים. הבקשה: "ניסוח טבעי בעברית, ידידותי, עם הצעת המשך".',
      who: ['ai-intake', 'llm'],
      relatedEntity: null,
      relatedMethod: null
    },

    op_user_confirm: {
      title: 'אישור האזרח להגיש',
      what: 'האזרח לוחץ על "מאשר" — או אומר "כן, תגיש". זה הרגע הקריטי שבו הוא מעניק לפלטפורמה ייפוי כוח להגיש בשמו.',
      when: 'אחרי שהאזרח רואה את ההצעה ומחליט.',
      how: 'WhatsApp Quick Reply Button או הודעת טקסט. האישור נשמר ב-DB עם timestamp, IP, וגרסת ההסכם שאישר.',
      who: ['citizen'],
      relatedEntity: 'ClaimCase',
      relatedMethod: null
    },

    op_handoff_to_agent: {
      title: 'העברה ל-Claim Agent',
      what: 'מהרגע שהאזרח אישר, ה-AI Intake מסיים את תפקידו ומעביר את הטיפול ל-Claim Agent — הסוכן שלוקח אחריות על התיק עד הסוף.',
      when: 'מיד אחרי האישור.',
      how: 'יצירת רשומה חדשה ב-ClaimCase, קישור ל-Twin ול-Module הרלוונטי. ה-Claim Agent מתחיל את ה-State Machine שלו.',
      who: ['ai-intake', 'claim-agent'],
      relatedEntity: 'ClaimCase',
      relatedMethod: 'ClaimController.createClaim'
    },

    /* === Track 02 · Execution === */
    op_create_claim: {
      title: 'יצירת תיק חדש',
      what: 'נוצר "תיק" במערכת שמייצג את הבקשה הספציפית הזו של האזרח הזה לזכות הזו. כל השלבים מכאן ועד המימוש קשורים לתיק הזה.',
      when: 'מיד אחרי האישור של האזרח.',
      how: 'INSERT ל-ClaimCase עם userId, moduleId, מצב התחלתי DRAFT, ו-timestamp. כל שינוי בתיק יתועד מכאן והלאה.',
      who: ['claim-agent'],
      relatedEntity: 'ClaimCase',
      relatedMethod: 'ClaimController.createClaim'
    },

    op_choose_adapter: {
      title: 'בחירת מסלול הגשה',
      what: 'לפי העיר של האזרח, הפלטפורמה בוחרת איך להגיש: בתל אביב — דרך הפורטל המקוון. בירושלים — במייל רשמי. בחיפה — כPDF חתום.',
      when: 'לפני ביצוע ההגשה.',
      how: 'lookup לפי municipalityId של האזרח. כל Adapter מודול נפרד שיודע את הפורמט והכללים של אותה עיר.',
      who: ['claim-agent', 'adapters'],
      relatedEntity: 'ClaimCase',
      relatedMethod: 'AuthorityAdapter.submit'
    },

    op_submit_to_authority: {
      title: 'הגשה בפועל לרשות',
      what: 'הבקשה הולכת לעירייה. בתל אביב — סוכן דפדפן ממלא טופס מקוון. בירושלים — נשלח מייל רשמי. בחיפה — מודפס PDF ונשלח. בכל המקרים, מקבלים מספר אסמכתא חזרה.',
      when: 'מיד אחרי בחירת ה-Adapter.',
      how: 'תל אביב: Playwright פותח דפדפן, נכנס לפורטל, ממלא ושולח. ירושלים: SMTP שולח מייל לאגף הגביה. חיפה: יצירת PDF + שליחה. בכל מקרה - שמירת מספר אסמכתא.',
      who: ['adapters', 'municipality'],
      relatedEntity: 'ClaimCase',
      relatedMethod: 'AuthorityAdapter.submit'
    },

    op_start_silent_clock: {
      title: 'הפעלת שעון אישור־שתיקה',
      what: 'מהרגע שההגשה נשלחה, יש לעירייה 60 יום לענות. אם היא שותקת — הזכות מתקבלת אוטומטית לפי החוק. הסוכן מפעיל שעון פנימי שיתעורר בדיוק ביום ה-60.',
      when: 'מיד אחרי ההגשה.',
      how: 'BullMQ יוצר job עם delay של 60 יום. ה-job ישכב במנוחה ב-Redis ויתעורר בדיוק בזמן הנכון. הוא ישרוד גם אם השרת ייפול וייקום.',
      who: ['claim-agent', 'queue'],
      relatedEntity: 'ClaimCase',
      relatedMethod: 'SilentApprovalQueue.add'
    },

    op_notify_user_submitted: {
      title: 'עדכון האזרח על ההגשה',
      what: 'האזרח מקבל הודעת WhatsApp: "הוגש לעירייה. מספר אסמכתא 12345. אעדכן אותך כשמשהו יקרה."',
      when: 'מיד אחרי ההגשה.',
      how: 'WhatsApp message פשוט. זו ההודעה האחרונה ל-60 יום אם הכל הולך חלק.',
      who: ['ai-intake', 'citizen'],
      relatedEntity: null,
      relatedMethod: null
    },

    op_poll_status: {
      title: 'בדיקת סטטוס תקופתית',
      what: 'כל 14 יום, הפלטפורמה בודקת אם משהו השתנה בעירייה — האם נוסף תיעוד? האם הסטטוס השתנה? אם כן, מטפלים בהתאם.',
      when: 'אוטומטית, כל 14 יום מההגשה.',
      how: 'BullMQ scheduled job שרץ פעם ב-14 יום לכל תיק פעיל. ניגש לפורטל הרשות (אם קיים), משווה למצב הקודם, ואם יש שינוי - מפעיל חוקים מתאימים.',
      who: ['queue', 'adapters', 'municipality'],
      relatedEntity: 'ClaimCase',
      relatedMethod: 'AuthorityAdapter.pollStatus'
    },

    op_receive_authority_email: {
      title: 'קבלת תגובה מהרשות',
      what: 'כשהעירייה עונה — אישור, דחייה, בקשת מסמך — התשובה מגיעה במייל לכתובת ייחודית של התיק (claim+12345@malach-hazchuyot.co.il).',
      when: 'בכל פעם שהעירייה עונה.',
      how: 'ספק מייל (Postmark/MailGun) שולח webhook לפלטפורמה כשהמייל מגיע. ה-Mailbox מזהה את התיק לפי הכתובת ומפעיל ניתוח של התוכן.',
      who: ['municipality', 'mailbox'],
      relatedEntity: 'ClaimCase',
      relatedMethod: 'MailboxHandler.onInboundMail'
    },

    op_update_claim_state: {
      title: 'עדכון מצב התיק',
      what: 'אחרי שתשובת העירייה התקבלה, הסוכן מעדכן את מצב התיק: APPROVED / REJECTED / NEED_DOC. כל מעבר מצב מתועד.',
      when: 'אחרי קבלת תשובה מהרשות.',
      how: 'State Machine מורחב עם 17 מצבים. כל מעבר מבוצע דרך transitionTo() שמתעד גם את הסיבה והנתונים.',
      who: ['claim-agent'],
      relatedEntity: 'ClaimCase',
      relatedMethod: 'ClaimController.transitionTo'
    },

    op_mark_approved: {
      title: 'סימון התיק כמאושר',
      what: 'העירייה אישרה את ההנחה. הסוכן רושם את התיק כ-APPROVED, שומר את מספר האסמכתא הסופי, ואת הסכום שיוחזר.',
      when: 'בקבלת תשובה חיובית.',
      how: 'UPDATE לרשומת ClaimCase, יצירת אירוע ב-ClaimEvent, וביטול ה-job של 60 יום (כי כבר אין בו צורך).',
      who: ['claim-agent'],
      relatedEntity: 'ClaimCase',
      relatedMethod: null
    },

    op_notify_user_success: {
      title: 'הודעת זכייה לאזרח',
      what: 'האזרח מקבל הודעה: "מצוין! העירייה אישרה. ההנחה: ₪450. אסמכתא: 12345. מצורף האישור הרשמי."',
      when: 'מיד אחרי שהתיק סומן כמאושר.',
      how: 'WhatsApp message + מצורף ה-PDF של האישור הרשמי שהתקבל מהעירייה.',
      who: ['ai-intake', 'citizen'],
      relatedEntity: null,
      relatedMethod: null
    },

    op_silent_approval_triggered: {
      title: 'הפעלת מנגנון אישור־שתיקה',
      what: 'עברו 60 יום והעירייה לא ענתה. השעון מתעורר. לפי תקנה 3ו(ה) — ההשגה התקבלה אוטומטית. הסוכן מתחיל לפעול.',
      when: 'בדיוק יום 60 אחרי ההגשה (או 90 אם ביקשו הארכה).',
      how: 'ה-BullMQ job מתעורר, בודק שהמצב עדיין FOLLOWUP (כלומר העירייה לא ענתה), ומשנה ל-SILENT_APPROVAL_TRIGGERED.',
      who: ['queue', 'claim-agent'],
      relatedEntity: 'ClaimCase',
      relatedMethod: 'SilentApprovalQueue.process'
    },

    op_send_silent_letter: {
      title: 'שליחת מכתב זכייה לעירייה',
      what: 'נשלח מכתב רשמי לעירייה: "בהתאם לתקנה 3ו(ה), השגתנו מתאריך X נחשבת מתקבלת. אנא עדכנו את הרישומים." זו הצהרה משפטית, לא בקשה.',
      when: 'מיד אחרי הפעלת מנגנון אישור־שתיקה.',
      how: 'מכתב מתואר אוטומטית עם הפרטים מהתיק, נשלח במייל ובדואר רשום לעירייה. תוכן המכתב חתום על ידי עו"ד מראש כתבנית.',
      who: ['adapters', 'municipality'],
      relatedEntity: 'ClaimCase',
      relatedMethod: null
    },

    op_analyze_rejection: {
      title: 'ניתוח עילת דחייה',
      what: 'אם העירייה דחתה, ה-AI קורא את הנימוק שלה ומבין למה. האם יש חוסר במסמך? פרשנות שגויה של החוק? סיבה פרוצדורלית? לכל סוג סיבה - אסטרטגיה אחרת.',
      when: 'מיד אחרי קבלת דחייה.',
      how: 'Claude מסווג את הדחייה לאחת מ-5 קטגוריות. לפי הקטגוריה - בוחרים אסטרטגיית המשך: השלמה, ערר, פנייה לנציב, או העברה לעו"ד.',
      who: ['claim-agent', 'llm'],
      relatedEntity: 'ClaimCase',
      relatedMethod: null
    },

    op_prepare_appeal: {
      title: 'הכנת כתב ערר',
      what: 'אם הדחייה נראית לא צודקת, ה-AI מכין כתב ערר משפטי מובנה: עובדות, רקע משפטי, נימוקי הערר, ובקשה.',
      when: 'אחרי שהדחייה סווגה כמתאימה לערר אוטונומי.',
      how: 'Claude מקבל את כל המסמכים מהתיק + ניתוח הדחייה ומחזיר טיוטה של כתב ערר. הטיוטה תקבל בדיקה משפטית של עו"ד הליווי.',
      who: ['claim-agent', 'llm'],
      relatedEntity: 'ClaimCase',
      relatedMethod: null
    },

    op_lawyer_sign_appeal: {
      title: 'אישור עו"ד הליווי',
      what: 'עו"ד הליווי מקבל את הטיוטה, בודק שהניסוח משפטי תקין, מתקן אם צריך, וחותם דיגיטלית. שכר טרחה: ₪150-300 לערר.',
      when: 'אחרי שטיוטת הערר מוכנה.',
      how: 'הטיוטה נשלחת לעו"ד דרך שירות החתימה הדיגיטלית. הוא בודק, מתקן אם צריך, וחותם. ה-PDF החתום חוזר לפלטפורמה.',
      who: ['lawyer-advisor', 'signing'],
      relatedEntity: 'ClaimCase',
      relatedMethod: null
    },

    op_submit_appeal: {
      title: 'הגשת ערר לוועדת הערר',
      what: 'הערר החתום מוגש רשמית לוועדת הערר של העירייה. דדליין: 30 יום מקבלת הדחייה. אם פספסנו - איבדנו את הזכות לערר.',
      when: 'תוך 30 יום מקבלת הדחייה.',
      how: 'דרך Authority Adapter — בדואר רשום בארבעה עותקים, או דרך פורטל מקוון של העירייה אם קיים. אישור קבלה נשמר.',
      who: ['adapters', 'appeal-cmt'],
      relatedEntity: 'ClaimCase',
      relatedMethod: null
    },

    /* === Track 03 · Admin === */
    op_login_admin: {
      title: 'כניסה לפאנל הניהול',
      what: 'Operator נכנס לכתובת admin.malach-hazchuyot.co.il. מזין שם משתמש, סיסמה, וקוד 2FA. רק מי שעבר את שלושת השלבים יכול להמשיך.',
      when: 'בכל כניסה לפאנל.',
      how: 'JWT httpOnly cookies + refresh tokens + 2FA דרך SMS או TOTP (אפליקציה כמו Google Authenticator). כל ניסיון כניסה נרשם ב-Audit Log.',
      who: ['operator', 'auth-mod'],
      relatedEntity: 'User',
      relatedMethod: 'AuthController.login'
    },

    op_view_active_cases: {
      title: 'תצוגת תיקים פעילים',
      what: 'Operator רואה טבלה של כל התיקים הפתוחים. שם של האזרח (מוסתר חלקית כדי לשמור על פרטיות), עיר, סוג זכות, מצב, ומתי הדדליין הבא.',
      when: 'במסך הראשי של הפאנל.',
      how: 'שאילתה ל-PostgreSQL עם JOIN בין ClaimCase, DigitalTwin, ו-RightModule. סינון אוטומטי של תיקים שמטופלים על ידי Operator הנוכחי.',
      who: ['operator', 'admin-panel'],
      relatedEntity: 'ClaimCase',
      relatedMethod: null
    },

    op_filter_cases: {
      title: 'סינון תיקים לפי פרמטרים',
      what: 'Operator יכול לסנן: לפי עיר, לפי מצב (FOLLOWUP / REJECTED / APPEAL), לפי דחיפות (תיקים קרובים לדדליין), לפי סוג זכות.',
      when: 'בתוך מסך התיקים.',
      how: 'פילטרים בצד הקליינט (Angular) שמתורגמים ל-WHERE clauses ב-DB. כל סינון משאיר את ה-state ב-URL כדי שאפשר יהיה לחזור.',
      who: ['operator', 'admin-panel'],
      relatedEntity: 'ClaimCase',
      relatedMethod: null
    },

    op_create_module: {
      title: 'יצירת מודול זכות חדש',
      what: 'Operator (משפטן זוטר) יוצר מודול זכות חדש: כותב את שם הזכות, את התנאים (Predicates), את נוסחת החישוב, ואת המסמכים הנדרשים. המודול נשמר במצב DRAFT.',
      when: 'כשמתפרסם חוק חדש או כשמתחילים לתמוך בזכות חדשה.',
      how: 'טופס באפליקציה עם validation. ה-Operator יכול גם להזין טקסט משפטי וה-AI יציע טיוטה התחלתית של ה-Predicates.',
      who: ['operator', 'catalog'],
      relatedEntity: 'RightModule',
      relatedMethod: 'CatalogController.publishModule'
    },

    op_edit_module: {
      title: 'עריכת מודול קיים',
      what: 'אם החוק התעדכן (למשל שיעור ההנחה השתנה), Operator עורך את המודול. כל שינוי יוצר גרסה חדשה (semantic versioning) - הגרסה הישנה לא נמחקת.',
      when: 'בעדכוני חקיקה או תיקוני ניסוח.',
      how: 'יצירת RightModule חדש עם version מעודכן. הישן עובר ל-DEPRECATED. תיקים פתוחים תחת הישן ממשיכים בו עד סיום.',
      who: ['operator', 'catalog'],
      relatedEntity: 'RightModule',
      relatedMethod: null
    },

    op_send_for_signature: {
      title: 'שליחה לחתימת עו"ד',
      what: 'מודול חדש או מעודכן נשלח לעו"ד מוסמך לחתימה דיגיטלית. רק לאחר חתימה - המודול הופך LIVE ויכול לשמש בהגשות.',
      when: 'אחרי שהעריכה הושלמה ואושרה פנימית.',
      how: 'יצירת PDF עם כל פרטי המודול, שליחתו דרך שירות חתימה (Zoho Sign וכד') לעו"ד. ה-PDF החתום חוזר ב-webhook.',
      who: ['admin-panel', 'signing', 'senior-lawyer'],
      relatedEntity: 'RightModule',
      relatedMethod: null
    },

    op_receive_signed_pdf: {
      title: 'קבלת המודול החתום',
      what: 'אחרי שהעו"ד חתם, ה-PDF החתום מתקבל אוטומטית, נשמר ב-S3, והמודול עובר למצב LIVE. מהרגע הזה הוא יכול לשמש בבדיקות זכאות.',
      when: 'מיד אחרי שהעו"ד סיים לחתום.',
      how: 'webhook משירות החתימה. ה-PDF נשמר ב-S3 עם hash, חתימה מאומתת אוטומטית, וה-RightModule.status מתעדכן ל-LIVE.',
      who: ['signing', 'catalog'],
      relatedEntity: 'RightModule',
      relatedMethod: null
    },

    op_human_required_alert: {
      title: 'התראה על תיק שצריך עו"ד',
      what: 'יש תיקים שהמערכת לא יכולה לטפל בהם אוטונומית — למשל כשנדרש ערעור לבית משפט מינהלי. במקרה כזה, Operator מקבל התראה והתיק עובר לעו"ד אנושי.',
      when: 'כשתיק עובר למצב HUMAN_LAWYER_REQUIRED.',
      how: 'Notification בתוך ה-Admin Panel + מייל ל-Operator. רשימה ייעודית של תיקים שדורשים יד אנושית.',
      who: ['claim-agent', 'admin-panel', 'operator'],
      relatedEntity: 'ClaimCase',
      relatedMethod: null
    },

    op_assign_to_lawyer: {
      title: 'הקצאת התיק לעו"ד',
      what: 'Operator בוחר עו"ד מתאים מהרשימה ומעביר אליו את התיק עם כל ההיסטוריה. שעון אישור־שתיקה נעצר עד שהעו"ד מחזיר תשובה.',
      when: 'אחרי שהתיק סומן כדורש עו"ד.',
      how: 'יצירת חבילה (PDF + מסמכים נלווים) ושליחתה לעו"ד. רישום הפעולה ב-ClaimEvent. השעון של 60 יום מושהה.',
      who: ['operator', 'admin-panel'],
      relatedEntity: 'ClaimCase',
      relatedMethod: null
    },

    op_pause_silent_clock: {
      title: 'השהיית שעון אישור־שתיקה',
      what: 'כשתיק עובר לטיפול אנושי, השעון האוטומטי של 60 יום נעצר — כי זה כבר לא הליך אוטונומי. הוא יחזור לפעול רק אם התיק יחזור למסלול האוטומטי.',
      when: 'כשתיק עובר ל-HUMAN_LAWYER_REQUIRED.',
      how: 'BullMQ job מקבל פקודת pause. ניתן יהיה להפעיל אותו שוב אם הסטטוס משתנה.',
      who: ['claim-agent', 'queue'],
      relatedEntity: 'ClaimCase',
      relatedMethod: null
    },

    op_view_dashboards: {
      title: 'צפייה בסטטיסטיקות',
      what: 'בעל המוצר רואה בזמן אמת: כמה תיקים פעילים, אחוז ההצלחה לכל עיר, זמן ממוצע למימוש, סכום מצטבר שהושג ללקוחות. הכל אגרגטיבי - בלי פרטי אזרחים ספציפיים.',
      when: 'במסך ה-Dashboards של הפאנל.',
      how: 'שאילתות מסונתזות ל-DB עם GROUP BY. נתונים אישיים מסוכמים ולא מוצגים פרטנית. עדכון בכל רענון של המסך.',
      who: ['founder', 'dashboards'],
      relatedEntity: null,
      relatedMethod: 'DashboardService.getKPIs'
    },

    op_export_report: {
      title: 'יצוא דוח',
      what: 'בעל המוצר יכול להוריד דוח Excel או PDF של תקופה ספציפית - חודשי, רבעוני, שנתי. שימושי לחשבונאות ולמדידת ביצועים.',
      when: 'לפי בקשה.',
      how: 'בחירת תקופה ופורמט. השרת מייצר את הדוח, שומר זמנית ב-S3, ושולח לינק להורדה. כל יצוא נרשם ב-Audit Log.',
      who: ['founder', 'dashboards'],
      relatedEntity: null,
      relatedMethod: null
    },

    op_register_data_archive: {
      title: 'רישום מאגר מידע',
      what: 'לפי החוק הישראלי, חובה לרשום את המאגר של נתוני האזרחים ברשם מאגרי המידע (במשרד המשפטים). זה תהליך פורמלי שמתבצע פעם ראשונה ומחודש שנתית.',
      when: 'לפני השקת המוצר לציבור, ובחידוש שנתי.',
      how: 'מילוי טופס מקוון באתר רשם מאגרי המידע: סוג מאגר, מטרת השימוש, סוגי נתונים, סטנדרטי אבטחה. תשלום אגרה. קבלת מספר רישום שיופיע במדיניות הפרטיות. הלקוח מבצע - BizTechoff מספקת את התיעוד הטכני.',
      who: ['dpo', 'privacy-authority'],
      relatedEntity: null,
      relatedMethod: null
    },

    op_audit_access: {
      title: 'בדיקת רישומי גישה',
      what: 'DPO ניגש ל-Audit Log ובודק מי ניגש לאיזה מידע ומתי. אם יש דפוס חשוד (גישות חריגות, גישה למידע ללא סיבה), DPO חוקר.',
      when: 'תקופתית (חודשי/רבעוני) ועם כל אירוע חריג.',
      how: 'שאילתות ל-AuditLog table. סינון לפי משתמש, תאריך, סוג פעולה. ייצוא לדוח סוף תקופה.',
      who: ['dpo', 'audit-log'],
      relatedEntity: 'AuditLog',
      relatedMethod: 'AuditService.report'
    },

    op_user_deletion_request: {
      title: 'בקשת מחיקה מאזרח',
      what: 'אזרח רשאי לבקש שמערכת תמחק את כל הנתונים שלה עליו. הבקשה מתבצעת תוך 30 יום, ומתועדת — מי ביצע, מתי, מה נמחק.',
      when: 'בכל פעם שאזרח מבקש מחיקה.',
      how: 'בקשה דרך WhatsApp או מייל. DPO מאשר. Admin Panel מבצע מחיקה רכה (soft delete) של ה-Twin, מסמכים, ושיחות. אחרי 30 יום - מחיקה קשה. תיעוד הפעולה לעולם נשמר.',
      who: ['citizen', 'dpo', 'admin-panel'],
      relatedEntity: 'DigitalTwin',
      relatedMethod: null
    },

    op_periodic_dpo_report: {
      title: 'דוח DPO תקופתי',
      what: 'אחת לתקופה (לרוב שנתי), DPO כותב דוח פנימי על מצב הציות לתקנות הפרטיות: כמה אירועים, איזה תיקונים בוצעו, מה הצפי לתקופה הבאה.',
      when: 'שנתי או לפי דרישה רגולטורית.',
      how: 'DPO ניגש ל-Audit Log, מסכם נתונים מצטברים, כותב הסבר על אירועים חריגים, ומציג להנהלה. במקרה של דליפת מידע - דיווח לרשות הפרטיות תוך 24 שעות.',
      who: ['dpo', 'privacy-authority'],
      relatedEntity: 'AuditLog',
      relatedMethod: null
    }
  },

  /* ================================================================
     ENTITIES - DB Tables / Data Models
     ================================================================ */
  entities: {
    DigitalTwin: {
      name: 'DigitalTwin',
      desc: 'הפרופיל הדיגיטלי של האזרח. כולל זהות, סטטוס, היסטוריה, ומסמכים.',
      fields: ['id', 'userId', 'identity (JSONB)', 'status (JSONB)', 'history (JSONB)', 'documents (JSONB[])', 'createdAt', 'updatedAt'],
      file: 'shared/entity/DigitalTwin.ts'
    },
    RightModule: {
      name: 'RightModule',
      desc: 'מודול זכות בודד. כולל את התנאים, החישוב, ופרטי ההגשה. חתום דיגיטלית.',
      fields: ['id', 'slug', 'version', 'status (DRAFT|LIVE|DEPRECATED)', 'predicates (JSONB)', 'calculation (JSONB)', 'signedAt', 'signedBy', 'signedPdfS3Key'],
      file: 'shared/entity/RightModule.ts'
    },
    RightVersion: {
      name: 'RightVersion',
      desc: 'גרסה היסטורית של מודול זכות. מאפשר חזרה אחורה לתיקים פעילים שנפתחו תחת גרסה ישנה.',
      fields: ['id', 'moduleId', 'version', 'effectiveFrom', 'effectiveUntil', 'snapshot (JSONB)'],
      file: 'shared/entity/RightVersion.ts'
    },
    ClaimCase: {
      name: 'ClaimCase',
      desc: 'תיק בודד של זכות שהוגשה. מנוהל על ידי State Machine.',
      fields: ['id', 'userId', 'twinId', 'moduleId', 'status', 'authorityId', 'submittedAt', 'silentClockEndsAt', 'rejectionReason', 'currentStage'],
      file: 'shared/entity/ClaimCase.ts'
    },
    ClaimEvent: {
      name: 'ClaimEvent',
      desc: 'כל אירוע שקרה בתיק ספציפי - מעבר מצב, התכתבות, מסמך שהתקבל.',
      fields: ['id', 'claimId', 'eventType', 'fromStatus', 'toStatus', 'data (JSONB)', 'createdAt'],
      file: 'shared/entity/ClaimEvent.ts'
    },
    ConversationSession: {
      name: 'ConversationSession',
      desc: 'מצב שיחה אקטיבית באמצעות AI Intake. נשמר ב-Redis עם TTL.',
      fields: ['userId', 'phoneNumber', 'history[]', 'currentField', 'startedAt', 'lastMessageAt'],
      file: 'shared/entity/ConversationSession.ts'
    },
    AuditLog: {
      name: 'AuditLog',
      desc: 'יומן גישה לכל פעולה במערכת. append-only.',
      fields: ['id', 'userId', 'action', 'targetType', 'targetId', 'ipAddress', 'userAgent', 'timestamp'],
      file: 'shared/entity/AuditLog.ts'
    },
    User: {
      name: 'User',
      desc: 'משתמש פנימי - Operator, founder, DPO, או lawyer. לא אזרחים.',
      fields: ['id', 'email', 'role (operator|founder|dpo|lawyer)', 'twoFactorSecret', 'createdAt'],
      file: 'shared/entity/User.ts'
    }
  },

  /* ================================================================
     METHODS - Key technical methods
     ================================================================ */
  methods: {
    'IntakeController.processMessage': {
      name: 'IntakeController.processMessage',
      signature: 'async processMessage(userId: string, message: Message): Promise<Response>',
      desc: 'נקודת כניסה לכל הודעת WhatsApp. מטפלת בטעינת session, עיבוד ההודעה, וכל ה-flow של הקליטה.',
      file: 'shared/controller/IntakeController.ts'
    },
    'IntakeController.nextQuestion': {
      name: 'IntakeController.nextQuestion',
      signature: 'async nextQuestion(twin: DigitalTwin): Promise<NextQ | null>',
      desc: 'בוחרת איזו שאלה לשאול את האזרח לפי שדות חסרים ב-Twin.',
      file: 'shared/controller/IntakeController.ts'
    },
    'TwinController.updateField': {
      name: 'TwinController.updateField',
      signature: 'async updateField(userId: string, path: string, value: any): Promise<DigitalTwin>',
      desc: 'מעדכנת שדה ספציפי בפרופיל. כל שינוי נשמר ב-event log.',
      file: 'shared/controller/TwinController.ts'
    },
    'TwinController.getTwin': {
      name: 'TwinController.getTwin',
      signature: 'async getTwin(userId: string): Promise<DigitalTwin>',
      desc: 'מחזירה את הפרופיל המלא של אזרח.',
      file: 'shared/controller/TwinController.ts'
    },
    'CatalogController.getModule': {
      name: 'CatalogController.getModule',
      signature: 'async getModule(slug: string, version?: string): Promise<RightModule>',
      desc: 'מחזירה מודול זכות חי לפי slug. אם version מצוין - מחזירה את הגרסה הספציפית.',
      file: 'shared/controller/CatalogController.ts'
    },
    'CatalogController.publishModule': {
      name: 'CatalogController.publishModule',
      signature: 'async publishModule(module: RightModule): Promise<void>',
      desc: 'מפרסמת מודול חדש - מפעילה zerimat חתימה ובסוף מעבירה ל-LIVE.',
      file: 'shared/controller/CatalogController.ts'
    },
    'EligibilityController.evaluate': {
      name: 'EligibilityController.evaluate',
      signature: 'evaluate(twin: DigitalTwin, module: RightModule): EvalResult',
      desc: 'הפונקציה המרכזית של בדיקת זכאות. מריצה Predicates ומחזירה תוצאה.',
      file: 'shared/controller/EligibilityController.ts'
    },
    'EligibilityController.classify': {
      name: 'EligibilityController.classify',
      signature: 'classify(results: PredicateResult[]): EligibilityResult',
      desc: 'מסווגת את התוצאות ל-ELIGIBLE / NOT_ELIGIBLE / INFO_NEEDED.',
      file: 'shared/controller/EligibilityController.ts'
    },
    'AuthorityAdapter.submit': {
      name: 'AuthorityAdapter.submit',
      signature: 'async submit(claim: ClaimCase, twin: DigitalTwin): Promise<SubmissionResult>',
      desc: 'מבצעת הגשה לרשות הספציפית. כל Adapter מממש את הממשק הזה אחרת.',
      file: 'shared/services/AuthorityAdapter.ts'
    },
    'AuthorityAdapter.pollStatus': {
      name: 'AuthorityAdapter.pollStatus',
      signature: 'async pollStatus(referenceId: string): Promise<ClaimStatus>',
      desc: 'בודקת סטטוס תיק בפורטל הרשות.',
      file: 'shared/services/AuthorityAdapter.ts'
    },
    'ClaimController.createClaim': {
      name: 'ClaimController.createClaim',
      signature: 'async createClaim(userId: string, moduleId: string): Promise<ClaimCase>',
      desc: 'יוצרת תיק חדש ומפעילה את ה-State Machine.',
      file: 'shared/controller/ClaimController.ts'
    },
    'ClaimController.transitionTo': {
      name: 'ClaimController.transitionTo',
      signature: 'async transitionTo(claimId: string, newStatus: ClaimStage, data?: any): Promise<void>',
      desc: 'מעבירה תיק למצב חדש ומתעדת אירוע ב-ClaimEvent.',
      file: 'shared/controller/ClaimController.ts'
    },
    'ClaimController.onClaimEvent': {
      name: 'ClaimController.onClaimEvent',
      signature: 'async onClaimEvent(claimId: string, event: ClaimEvent): Promise<void>',
      desc: 'מטפלת באירועים שמגיעים מבחוץ - תגובת רשות, אישור־שתיקה, וכו.',
      file: 'shared/controller/ClaimController.ts'
    },
    'SilentApprovalQueue.add': {
      name: 'SilentApprovalQueue.add',
      signature: 'async add(claimId: string, delayDays: number): Promise<Job>',
      desc: 'יוצרת job של אישור־שתיקה עם delay. ה-job יתעורר בדיוק ביום ה-X.',
      file: 'server/queues/SilentApprovalQueue.ts'
    },
    'SilentApprovalQueue.process': {
      name: 'SilentApprovalQueue.process',
      signature: 'process(job: Job): Promise<void>',
      desc: 'מטפלת ב-job שהתעורר. בודקת אם הרשות ענתה - אם לא, מפעילה את המנגנון.',
      file: 'server/queues/SilentApprovalQueue.ts'
    },
    'MailboxHandler.onInboundMail': {
      name: 'MailboxHandler.onInboundMail',
      signature: 'async onInboundMail(email: InboundEmail): Promise<void>',
      desc: 'מטפלת במייל שהתקבל מרשות. מזהה את התיק ומעבירה ל-Claim Agent.',
      file: 'server/handlers/MailboxHandler.ts'
    },
    'MailboxHandler.classifyEmail': {
      name: 'MailboxHandler.classifyEmail',
      signature: 'async classifyEmail(body: string): Promise<EmailIntent>',
      desc: 'משתמשת ב-Claude כדי לסווג מייל - אישור / דחייה / בקשת מסמך.',
      file: 'server/handlers/MailboxHandler.ts'
    },
    'AuthController.login': {
      name: 'AuthController.login',
      signature: 'async login(email: string, password: string, otp: string): Promise<AuthResponse>',
      desc: 'אימות שלוש שכבות - סיסמה + OTP + JWT.',
      file: 'shared/controller/AuthController.ts'
    },
    'AuthController.refresh': {
      name: 'AuthController.refresh',
      signature: 'async refresh(refreshToken: string): Promise<AuthResponse>',
      desc: 'rotation של tokens - מנפיקה JWT חדש.',
      file: 'shared/controller/AuthController.ts'
    },
    'VisionService.extractFromImage': {
      name: 'VisionService.extractFromImage',
      signature: 'async extractFromImage(imageS3Key: string, schema: Schema): Promise<ExtractedData>',
      desc: 'מחלצת נתונים מובנים מתמונה לפי schema.',
      file: 'shared/services/VisionService.ts'
    },
    'VisionService.validateExtracted': {
      name: 'VisionService.validateExtracted',
      signature: 'validateExtracted(data: ExtractedData): ValidationResult',
      desc: 'בודקת תקינות הנתונים שחולצו (ספרת ביקורת ת.ז וכו).',
      file: 'shared/services/VisionService.ts'
    },
    'AuditService.logAccess': {
      name: 'AuditService.logAccess',
      signature: 'async logAccess(userId: string, action: string, target: string): Promise<void>',
      desc: 'רושמת גישה ב-Audit Log. נקראת אוטומטית על ידי middleware.',
      file: 'shared/services/AuditService.ts'
    },
    'AuditService.report': {
      name: 'AuditService.report',
      signature: 'async report(from: Date, to: Date): Promise<AuditReport>',
      desc: 'מייצרת דוח גישות לתקופה. רק DPO ו-founder יכולים להריץ.',
      file: 'shared/services/AuditService.ts'
    },
    'DashboardService.getKPIs': {
      name: 'DashboardService.getKPIs',
      signature: 'async getKPIs(period: Period): Promise<KPIs>',
      desc: 'מחשבת מטריקות לתקופה - תיקים פעילים, אחוז הצלחה, סכומים.',
      file: 'shared/services/DashboardService.ts'
    }
  }
};

// Make available globally
if (typeof window !== 'undefined') {
  window.ARCH_DATA = ARCH_DATA;
}
if (typeof module !== 'undefined' && module.exports) {
  module.exports = ARCH_DATA;
}
