type CarouselTemplateContent = Array<Record<string, unknown>>

type ComparisonTemplateContent = {
  title: string
  eyebrow: string
  myth: { head: string; body: string }
  fact: { head: string; body: string }
  takeaway: string
}

type WarningTemplateContent = {
  eyebrow: string
  title: string
  subtitle: string
  flags: Array<{ num: string; title: string; desc: string }>
  cta: string
}

type AnatomyTemplateContent = {
  eyebrow: string
  title: string
  stat: string
  statContext: string
  pillars: Array<{ id: string; name: string; desc: string; tag: string }>
  action: string
}

type SpotlightTemplateContent = {
  eyebrow: string
  title: string
  subtitle: string
  clubs: Array<{ id: string; name: string; desc: string; vibe: string }>
  action: string
}

export type EditorialInstagramPackage =
  | {
      slug: 'barcelona-club-reality-what-most-people-get-wrong'
      template: 'debunk'
      title: string
      content: ComparisonTemplateContent
    }
  | {
      slug: 'barcelona-membership-rules-2026'
      template: 'explainer'
      title: string
      content: CarouselTemplateContent
    }
  | {
      slug: 'barcelona-club-red-flags'
      template: 'audit'
      title: string
      content: WarningTemplateContent
    }
  | {
      slug: 'why-barcelona-clubs-are-under-pressure-2026'
      template: 'blueprint'
      title: string
      content: AnatomyTemplateContent
    }
  | {
      slug: 'how-scm-thinks-about-verification'
      template: 'spotlight'
      title: string
      content: SpotlightTemplateContent
    }

export const EDITORIAL_INSTAGRAM_PACKAGES: EditorialInstagramPackage[] = [
  {
    slug: 'barcelona-club-reality-what-most-people-get-wrong',
    template: 'debunk',
    title: 'Barcelona Club Reality: What Most People Still Get Wrong',
    content: {
      title: 'Reality vs Rumor',
      eyebrow: 'Barcelona 2026',
      myth: {
        head: 'THE RUMOR',
        body: 'Barcelona clubs work like public coffeeshops, so if a place looks polished and says yes quickly, that is a good sign.',
      },
      fact: {
        head: 'THE REALITY',
        body: 'The private association model is the point. When a club feels too public, too fast, or too retail, the risk picture usually gets worse, not better.',
      },
      takeaway:
        'If it feels built for speed instead of discretion, you are probably looking at the wrong kind of club.',
    },
  },
  {
    slug: 'barcelona-membership-rules-2026',
    template: 'explainer',
    title: 'Membership Rules in Barcelona Clubs',
    content: [
      {
        slide: 1,
        title: 'Membership Rules',
        body: [
          'Barcelona clubs do not all run the same intake model.',
          'Policy, local practice, and formal legal interpretation are not the same thing.',
          'That is where most confusion starts.',
        ],
        footnote: 'Swipe for the distinctions that actually matter.',
        brand: 'Independent. Verified. Free.',
        url: 'socialclubsmaps.com',
      },
      {
        slide: 2,
        eyebrow: 'The reset',
        title: 'There is no universal club rule.',
        body: [
          'Some clubs are more restrictive. Some are more procedural.',
          'Some care more about referrals. Some care more about fit and discretion.',
          'Shortcut advice usually flattens a more sensitive reality.',
        ],
        url: 'socialclubsmaps.com',
      },
      {
        slide: 3,
        title: 'What membership is really doing',
        subtitle: 'A stronger intake process usually tries to protect the private association model.',
        list: [
          {
            head: 'Identity and age checks',
            desc: 'A serious process normally verifies who you are instead of rushing you through.',
          },
          {
            head: 'House-rule clarity',
            desc: 'Good clubs explain conduct, privacy, and what members are actually joining.',
          },
          {
            head: 'Controlled access',
            desc: 'Friction is not always bad. In this space, it can be a signal of legitimacy.',
          },
        ],
        brand: 'Do it right, not fast.',
        url: 'socialclubsmaps.com',
      },
      {
        slide: 4,
        title: 'What people keep confusing',
        subtitle: 'Three things get collapsed into one lazy answer.',
        list: [
          {
            head: 'Club policy',
            desc: 'Internal caution, local norms, and member culture can shape how a club screens people.',
          },
          {
            head: 'Local practice',
            desc: 'Barcelona pressure changes behavior even when the formal legal text is debated.',
          },
          {
            head: 'Black-letter law',
            desc: 'Not every outcome at the door is a clean statement of universal law.',
          },
        ],
        closing: 'Club policy is not always the same thing as law.',
        url: 'socialclubsmaps.com',
      },
      {
        slide: 5,
        title: 'What a stronger club usually signals',
        subtitle: 'Read the posture, not just the answer.',
        list: [
          {
            head: 'Discretion',
            desc: 'The club does not perform itself like a tourist-facing public venue.',
          },
          {
            head: 'Process',
            desc: 'There is a real membership step, not instant-entry theater.',
          },
          {
            head: 'Consistency',
            desc: 'Rules sound thought through, not improvised under pressure.',
          },
          {
            head: 'Respect for context',
            desc: 'The club behaves like it understands the Barcelona environment it sits inside.',
          },
        ],
        closing: 'A careful process can be a sign of legitimacy.',
        url: 'socialclubsmaps.com',
      },
      {
        slide: 6,
        eyebrow: 'Before you rely on shortcuts',
        title: 'Start with the right frame.',
        action: 'Get the free Safety Kit.',
        inside: [
          'legal context that actually matters',
          'street-level red flags',
          'privacy and etiquette basics',
          'what to do when something feels off',
        ],
        closing: 'Free forever. Link in bio.',
        url: 'socialclubsmaps.com',
      },
    ],
  },
  {
    slug: 'barcelona-club-red-flags',
    template: 'audit',
    title: 'Barcelona Club Red Flags',
    content: {
      eyebrow: 'SCM Audit',
      title: 'Red Flags',
      subtitle: 'Three signals respectful people should never brush off.',
      flags: [
        {
          num: '01',
          title: 'Street-pitch energy',
          desc: 'If the whole posture feels built to catch strangers fast, that usually points away from a serious private-association culture.',
        },
        {
          num: '02',
          title: 'Instant yes, zero process',
          desc: 'Weak identity checks, vague rules, and no real onboarding are not convenience wins. They are warning signs.',
        },
        {
          num: '03',
          title: 'Retail language everywhere',
          desc: 'When a club sounds more like a public storefront than a member association, slow down and reassess the legitimacy signal.',
        },
      ],
      cta: 'Verify your club before you trust it.',
    },
  },
  {
    slug: 'why-barcelona-clubs-are-under-pressure-2026',
    template: 'blueprint',
    title: 'Why Barcelona Clubs Are Under Pressure in 2026',
    content: {
      eyebrow: 'Barcelona Pressure Map',
      title: 'Why Clubs Are Under Pressure',
      stat: '4X',
      statContext:
        'Barcelona club pressure is not one story. It is tourism, neighborhood fatigue, commercialization risk, and scrutiny hitting the same system at once.',
      pillars: [
        {
          id: 'P-01',
          name: 'Tourism intensity',
          desc: 'High visitor volume pushes outsiders to read clubs as leisure products instead of sensitive private associations.',
          tag: 'VISITOR',
        },
        {
          id: 'P-02',
          name: 'Neighborhood fatigue',
          desc: 'Residents and local politics react hardest when clubs appear to increase noise, foot traffic, or public-facing disorder.',
          tag: 'CIVIC',
        },
        {
          id: 'P-03',
          name: 'Commercial appearance',
          desc: 'The more a club looks like a business selling access, the more legal and enforcement risk tends to rise.',
          tag: 'RISK',
        },
        {
          id: 'P-04',
          name: 'Political scrutiny',
          desc: 'Barcelona already has a history of closures and regulatory pressure, so weak operators raise the stakes for everyone.',
          tag: 'ENFORCEMENT',
        },
      ],
      action: 'Read the full pressure briefing.',
    },
  },
  {
    slug: 'how-scm-thinks-about-verification',
    template: 'spotlight',
    title: 'How SCM Thinks About Verification',
    content: {
      eyebrow: 'Verification Standard',
      title: 'What SCM Actually Checks',
      subtitle: 'A small verified set beats a giant unvetted list. These are the four checks behind that standard.',
      clubs: [
        {
          id: '01',
          name: 'Registry status',
          desc: 'We check whether the association structure appears real, current, and documented before trust is even on the table.',
          vibe: 'Structure, Legibility, Baseline',
        },
        {
          id: '02',
          name: 'House rules and posture',
          desc: 'We look for signals that the club still behaves like a private association instead of drifting into public-retail energy.',
          vibe: 'Discretion, Policy, Fit',
        },
        {
          id: '03',
          name: 'Premises and access',
          desc: 'Controlled entry, low-visibility behavior, and a coherent physical setup matter more than glossy branding.',
          vibe: 'Access, Privacy, Control',
        },
        {
          id: '04',
          name: 'Onboarding flow',
          desc: 'A responsible membership process should feel documented and intentional, not built to push strangers through fast.',
          vibe: 'Process, Seriousness, Trust',
        },
      ],
      action: 'Start with the Safety Kit.',
    },
  },
]

export function getEditorialInstagramPackage(slug: string) {
  return EDITORIAL_INSTAGRAM_PACKAGES.find((pkg) => pkg.slug === slug)
}
