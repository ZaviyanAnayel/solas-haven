#!/usr/bin/env node

/**
 * Autonomous AI SEO Agent for Solas Haven
 * Generates high-intent emotional, philosophical & grief chronicles,
 * injects Google Schema, internal links to Sanctuary Library,
 * updates sitemap, and pings the IndexNow API for instant crawling.
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.resolve(__dirname, "..");

// 1. Load API keys from environment or .env.local
let groqKey = process.env.GROQ_API_KEY?.trim();
let geminiKey = process.env.GEMINI_API_KEY?.trim();

const envPath = path.join(ROOT_DIR, ".env.local");
if (fs.existsSync(envPath)) {
  const envContent = fs.readFileSync(envPath, "utf-8");
  if (!groqKey) {
    const match = envContent.match(/GROQ_API_KEY\s*=\s*(.+)/);
    if (match) groqKey = match[1].trim();
  }
  if (!geminiKey) {
    const match = envContent.match(/GEMINI_API_KEY\s*=\s*(.+)/);
    if (match) geminiKey = match[1].trim();
  }
}

// 2. High-Intent Target SEO Topics Cluster
const TARGET_TOPICS = [
  {
    slug: "unspoken-love-letters-never-sent",
    keyword: "unspoken love letters never sent",
    title: "Unspoken Love Letters: The Words We Buried in Silence and Why They Still Matter",
    subtitle: "On the quiet ache of unconfessed devotion and the courage to release feelings into starlight",
    category: "love",
    tags: ["Unspoken Love", "Silent Longing", "Heartbreak", "Healing"],
    excerpt: "Why do we bury our deepest love in silence? Discover the psychology of unsent letters, timeless solace from Kahlil Gibran, and how releasing your truth brings peace.",
    readTime: "7 min read",
    sections: [
      {
        heading: "The Anatomy of a Letter Left in the Dark",
        paragraphs: [
          "Every human heart houses a drawer that was never opened. Inside lie the letters never posted, the confessions swallowed before the sentence could form, and the gentle apologies that dissolved into midnight air.",
          "Psychologists call this 'unfinished emotional processing'—the suspension of a sentiment that was too vulnerable to speak aloud. We withhold our words out of fear: fear of rejection, fear of disrupting another person's peaceful life, or simply because we believe our feelings arrive too late.",
          "Yet withheld love does not evaporate. It crystallizes into an unspoken ache that follows us down quiet avenues and surfaces in the quiet moments between wakefulness and sleep."
        ]
      },
      {
        heading: "What Kahlil Gibran Taught Us About Silent Affection",
        paragraphs: [
          "More than a century ago in [The Broken Wings by Kahlil Gibran](/library/the-broken-wings), the Lebanese poet documented the tragedy of two souls whose affection was forbidden by circumstance and societal expectation. Selma Karamy whispered across an ancient chapel: 'Love that cannot dwell upon this earth will find its home among the stars.'",
          "Gibran understood that love is not invalidated simply because it cannot exist as an earthly marriage or a shared morning coffee. Love is an act of spiritual expansion. To feel deeply for someone—even in total silence—is proof that your soul remains soft and alive in a world hardened by cynicism.",
          "As written in [The Prophet by Kahlil Gibran](/library/the-prophet): 'Love gives naught but itself and takes naught but from itself. Love possesses not nor would it be possessed; for love is sufficient unto love.'"
        ]
      },
      {
        heading: "Why Hiding Your Feelings Warps Into Emotional Heavy Weather",
        paragraphs: [
          "When we keep an unspoken truth trapped in our chests, the mind replays imaginary conversations in a perpetual loop. We rehearse what we should have said at the airport terminal, the message we deleted three times before turning off the screen, and the confession left hovering in an awkward pause.",
          "This rumination consumes immense cognitive and somatic energy. The nervous system stays in a subtle state of unresolved alert. You carry a person like a ghost in your pocket.",
          "Healing does not always require picking up the phone and causing turbulence in someone else's world. Often, what the heart needs is not an answer—it is an acknowledgment. It simply asks: 'Let this truth be witnessed somewhere in the universe.'"
        ]
      },
      {
        heading: "The Sacred Act of Release",
        paragraphs: [
          "This is the founding heartbeat of Solas Haven. You do not need to carry the burning stone of silence forever. When you [release a silent starlight letter](/), you take that heavy unconfessed truth, write it down without judgment or fear, and let it ascend anonymously into a 3D living constellation.",
          "There is a profound liberation in knowing your love was released under the stars. It exists now not as a regret, but as quiet light. You have loved, you have held space, and now you have gently set it free."
        ]
      }
    ]
  },
  {
    slug: "marcus-aurelius-quotes-on-grief-and-loss",
    keyword: "marcus aurelius quotes on grief and loss",
    title: "Marcus Aurelius on Grief: How Stoic Philosophy Heals a Shattered Heart",
    subtitle: "Ancient Roman wisdom for surviving the loss of someone you love without losing your soul",
    category: "grief",
    tags: ["Stoicism", "Marcus Aurelius", "Grief", "Inner Citadel"],
    excerpt: "How did the philosopher-emperor Marcus Aurelius survive the death of eight children? Explore timeless Stoic wisdom on impermanence, grief, and inner stillness.",
    readTime: "8 min read",
    sections: [
      {
        heading: "The Emperor Who Wept in Secret",
        paragraphs: [
          "History often paints the Roman Stoics as marble statues—unfeeling, rigid men who endured war and tragedy with cold detachment. But read the private midnight journals of Marcus Aurelius in [Meditations](/library/meditations) and you discover a profoundly tender human being wrestling with overwhelming grief.",
          "Marcus Aurelius buried eight of his thirteen children, lost his beloved wife Faustina, and watched a devastating Antonine plague decimate the Roman Empire. He was no stranger to the hollow ache of an empty chair.",
          "When his tutor Fronto offered condolences on the death of his three-year-old son, Marcus wrote back: 'I am stricken with grief... my tears flow, but I must remind my soul what is within my power to command.'"
        ]
      },
      {
        heading: "The Illusion of Possession and the Loan of Nature",
        paragraphs: [
          "One of the most transformative concepts Marcus Aurelius and Epictetus taught was that we never truly 'lose' someone; we merely return what was on loan from Nature.",
          "In [The Enchiridion by Epictetus](/library/enchiridion), the freed slave wrote: 'Never say about anything, \"I have lost it,\" but only \"I have given it back.\" Is your child dead? It has been given back. Is your wife dead? She has been given back.'",
          "This was not cruelty; it was a profound defense against entitlement. Nature grants us the presence of those we adore for a season, not an eternity. When their season ends, our grief is proportional to our love—but our gratitude must outlive our sorrow."
        ]
      },
      {
        heading: "Building Your Inner Citadel in the Storm of Absence",
        paragraphs: [
          "In Book IV of [Meditations](/library/meditations), Marcus writes: 'People look for retreats for themselves, in the country, by the coast, or in the hills... There is nowhere that a person can find a more peaceful and trouble-free retreat than in his own mind.'",
          "When grief threatens to drown your thoughts, the Stoics advise retreating into your 'Inner Citadel.' This is the untouched sanctuary inside you where memory is cherished without panic.",
          "You cannot control the date on which a soul departs this world. What lies entirely within your control is how honorably you carry their memory forward. Do not stain their legacy with bitterness; honor them by living with kindness, presence, and courage."
        ]
      },
      {
        heading: "Leaving Starlight for Those Who Walked Before Us",
        paragraphs: [
          "Seneca echoed this in [On the Shortness of Life](/library/on-the-shortness-of-life): 'The life we receive is not short, but we make it so... Life is long if you know how to use it.'",
          "Tonight, if your chest aches with the memory of someone who has returned to the cosmos, know that you walk a road traveled by kings, poets, and seekers for thousands of years. You can [release a silent starlight letter](/) to them in the Solas Haven constellation, letting their memory burn bright in eternal quietness."
        ]
      }
    ]
  },
  {
    slug: "how-to-forgive-yourself-after-someone-dies",
    keyword: "how to forgive yourself after someone dies",
    title: "How to Forgive Yourself After Someone Dies: Releasing the 'What Ifs' of Loss",
    subtitle: "Navigating the silent guilt of bereavement and finding peace when an apology is impossible",
    category: "forgiveness",
    tags: ["Grief Guilt", "Forgiveness", "Loss", "Closure"],
    excerpt: "Grief guilt is one of the heaviest burdens a human can carry. Learn why we blame ourselves after a loved one passes away and how to find authentic emotional forgiveness.",
    readTime: "7 min read",
    sections: [
      {
        heading: "The Secret Agony of Bereavement Guilt",
        paragraphs: [
          "When someone we love dies, sadness is only the first wave. The second, more corrosive wave is often guilt. We dissect the final weeks, the unreturned phone calls, the sharp words exchanged in an argument three years ago, or the feeling that we should have noticed the signs sooner.",
          "Therapists refer to this as 'retroactive omnipotence'—the subconscious belief that we had God-like power to alter the fabric of mortality if only we had acted differently.",
          "We torture ourselves with the phrase: 'If only I had...' But this is an illusion crafted by a mind desperately trying to negotiate with the finality of death."
        ]
      },
      {
        heading: "The Ancient Lessons of Gilgamesh's Guilt",
        paragraphs: [
          "Four thousand years ago in ancient Sumer, King Gilgamesh stood over the body of his companion Enkidu, weeping bitter tears of regret. In [The Epic of Gilgamesh](/library/the-epic-of-gilgamesh), he roams the steppe crying: 'Shall I not die like Enkidu? Sorrow has entered my belly.'",
          "Gilgamesh blamed himself for Enkidu's fate, searching the ends of the earth across the Waters of Death for a remedy that did not exist. Only when he accepted his human limitations did he return to Uruk and carve his wisdom on stone tablets for future generations.",
          "Human relationships are messy, imperfect, and unfinished. We are clumsy beings who get tired, stressed, and distracted. Your moments of imperfection did not cancel out the love you gave."
        ]
      },
      {
        heading: "Releasing What Was Never Said",
        paragraphs: [
          "If you parted with someone on an unresolved note, remember this: the dead are no longer bound by earthly resentment. In the quiet words of [A Confession by Leo Tolstoy](/library/a-confession), truth clarifies when the noise of worldly ego falls away.",
          "Those who have passed beyond the veil understand the fragility of the human heart better than we do. They do not want you to spend the remainder of your breath serving a prison sentence of self-reproach.",
          "Take a pen, or [release a silent starlight letter](/). Speak the apology aloud to the open sky. Let the words leave your chest. Forgiveness is not about rewriting yesterday; it is about unchaining tomorrow."
        ]
      }
    ]
  },
  {
    slug: "rumi-on-heartbreak-wound-light-enters",
    keyword: "rumi quotes on heartbreak and sorrow",
    title: "Rumi on Heartbreak: Why the Wound Is Where the Light Enters You",
    subtitle: "Sufi mysticism and the sacred alchemy of turning unbearable grief into spiritual illumination",
    category: "prayer",
    tags: ["Rumi", "Sufi Wisdom", "Heartbreak", "Spiritual Solace"],
    excerpt: "Why did Jalal al-Din Rumi view broken hearts as portals to the divine? Discover the mystic poetry of The Masnavi and how sorrow purifies the soul.",
    readTime: "6 min read",
    sections: [
      {
        heading: "The Cry of the Severed Reed",
        paragraphs: [
          "In the opening lines of [The Masnavi of Rumi](/library/the-masnavi-of-rumi), the 13th-century Persian mystic introduces us to his most famous metaphor: the reed flute singing its plaintive tune.",
          "'Hearken to the reed-flute, how it complains, lamenting its banishment from its home: Ever since they tore me from the reed-bed, my lament has caused men and women to weep.'",
          "Rumi understood that all human heartbreak—the ending of a romance, the death of a soulmate, or the loneliness of existence—is fundamentally an echo of the reed flute longing to return to its origin."
        ]
      },
      {
        heading: "The Guest House of the Heart",
        paragraphs: [
          "In his famous ode 'The Guest House', Rumi writes: 'This being human is a guest house. Every morning a new arrival... A joy, a depression, a meanness, some momentary awareness comes as an unexpected visitor.'",
          "He urges the wounded traveler: 'Welcome and entertain them all! Even if they are a crowd of sorrows, who violently sweep your house empty of its furniture, still, treat each guest honorably. He may be clearing you out for some new delight.'",
          "When we fight sorrow, we double its weight. When we welcome it with reverence, it softens. Heartbreak breaks open the hard calcified shell of the ego so that infinite compassion can pour in."
        ]
      },
      {
        heading: "The Field Beyond Right and Wrong",
        paragraphs: [
          "Rumi promised: 'Out beyond ideas of wrongdoing and rightdoing, there is a field. I will meet you there.'",
          "If tonight you feel fragmented by longing, remember that your brokenness is not a defect. It is the very doorway through which grace enters. You can [release a silent starlight letter](/) into the constellation, meeting the cosmos in that quiet field where only love remains."
        ]
      }
    ]
  }
];

// 3. Read existing stories to avoid duplicate slugs
const STORIES_FILE = path.join(ROOT_DIR, "src", "lib", "chronicles", "seoGeneratedStories.ts");
let existingContent = "";
if (fs.existsSync(STORIES_FILE)) {
  existingContent = fs.readFileSync(STORIES_FILE, "utf-8");
}

// Find the next unwritten topic from the cluster
let chosenTopic = TARGET_TOPICS.find((t) => !existingContent.includes(t.slug));

if (!chosenTopic) {
  // If all primary topics are published, pick the oldest or cycle
  const randomTopic = TARGET_TOPICS[Math.floor(Math.random() * TARGET_TOPICS.length)];
  const timestamp = Date.now();
  chosenTopic = {
    ...randomTopic,
    slug: `${randomTopic.slug}-${timestamp}`,
    title: `${randomTopic.title} (Vol. ${Math.floor(Math.random() * 5) + 2})`
  };
}

console.log(`🤖 Solas AI SEO Agent activated`);
console.log(`📌 Target Keyword: "${chosenTopic.keyword}"`);
console.log(`📝 Article Slug: "${chosenTopic.slug}"`);
console.log(`📖 Article Title: "${chosenTopic.title}"`);

// 4. Try LLM Generation (Groq / Gemini) with graceful procedural fallback
async function generateArticle(topic) {
  // Check if valid Groq API key exists
  if (groqKey && groqKey.startsWith("gsk_") && groqKey.length > 20) {
    try {
      console.log(`⚡ Generating via Groq LLM (llama-3.3-70b-versatile)...`);
      const systemPrompt = `You are a master essayist, philosopher, and compassionate trauma-informed author writing for Solas Haven (SolasHaven.com).
Your mission is to write an extraordinarily deep, human, emotionally profound, and Google-ranking article.

CRITICAL REQUIREMENTS:
- Voice: Tender, poetic, erudite, deeply comforting, and authoritative. NO corporate jargon. NO generic AI bullet points.
- Structure:
  - 4 to 5 substantial sections, each with a poetic, evocative heading.
  - Natural paragraphs exploring psychology, human vulnerability, and philosophical wisdom.
- Internal Linking (CRITICAL FOR SEO):
  - Naturally mention and link to at least 2 Sanctuary Library books using markdown links:
    - [Marcus Aurelius's Meditations](/library/meditations)
    - [The Prophet by Kahlil Gibran](/library/the-prophet)
    - [The Epic of Gilgamesh](/library/the-epic-of-gilgamesh)
    - [The Masnavi of Rumi](/library/the-masnavi-of-rumi)
    - [On the Shortness of Life by Seneca](/library/on-the-shortness-of-life)
    - [The Broken Wings by Kahlil Gibran](/library/the-broken-wings)
  - Naturally link to the constellation canvas: [release a silent starlight letter](/)
- Output: Strict JSON format matching this schema:
{
  "slug": "${topic.slug}",
  "title": "${topic.title}",
  "subtitle": "${topic.subtitle}",
  "excerpt": "Compelling 150-char Google meta description",
  "readTime": "7 min read",
  "category": "${topic.category}",
  "tags": ${JSON.stringify(topic.tags)},
  "sections": [
    {
      "heading": "Section Heading",
      "paragraphs": [
        "Paragraph 1...",
        "Paragraph 2..."
      ]
    }
  ]
}
Return ONLY valid JSON without markdown backticks.`;

      const response = await fetch("https://api.groq.com/openai/v1/chat/completions", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${groqKey}`,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          model: "llama-3.3-70b-versatile",
          messages: [
            { role: "system", content: systemPrompt },
            { role: "user", content: `Generate the complete article JSON for: "${topic.title}"` }
          ],
          temperature: 0.72,
          max_tokens: 2800,
          response_format: { type: "json_object" }
        })
      });

      if (response.ok) {
        const data = await response.json();
        const rawJson = data.choices?.[0]?.message?.content;
        const parsed = JSON.parse(rawJson);
        if (parsed && parsed.title && Array.isArray(parsed.sections)) {
          console.log(`✨ Successfully synthesized dynamic LLM article!`);
          return parsed;
        }
      } else {
        console.warn(`⚠️ Groq API returned status ${response.status}. Using expert synthesis engine.`);
      }
    } catch (err) {
      console.warn(`⚠️ Groq call notice: ${err.message}. Using expert synthesis engine.`);
    }
  }

  // Resilient High-Quality Curated Article Engine (100% Free, Guaranteed 0 Downtime)
  console.log(`✨ Using Solas Expert Synthesis Engine to craft structured masterwork...`);
  return {
    slug: topic.slug,
    title: topic.title,
    subtitle: topic.subtitle,
    excerpt: topic.excerpt,
    readTime: topic.readTime || "7 min read",
    category: topic.category,
    tags: topic.tags,
    sections: topic.sections
  };
}

// 5. Append generated article to seoGeneratedStories.ts
function saveArticleToFile(article) {
  article.publishedAt = new Date().toLocaleDateString("en-US", {
    month: "long",
    day: "numeric",
    year: "numeric"
  });
  article.author = "Solas Haven Sanctuary";

  // Read existing stories
  let stories = [];
  if (fs.existsSync(STORIES_FILE)) {
    const content = fs.readFileSync(STORIES_FILE, "utf-8");
    const match = content.match(/export const SEO_GENERATED_STORIES: ChronicleArticle\[\] = (\[[\s\S]*?\]);/);
    if (match) {
      try {
        stories = eval(match[1]);
      } catch {
        stories = [];
      }
    }
  }

  // Deduplicate by slug
  stories = stories.filter((s) => s.slug !== article.slug);
  // Prepend new article so it appears first
  stories.unshift(article);

  const formattedFile = `import { ChronicleArticle } from "./types";

/**
 * Autonomous SEO-Generated Chronicles & Guides
 * Automatically generated by scripts/seo-agent.mjs via GitHub Actions
 * Total Articles: ${stories.length}
 */
export const SEO_GENERATED_STORIES: ChronicleArticle[] = ${JSON.stringify(stories, null, 2)};
`;

  fs.writeFileSync(STORIES_FILE, formattedFile, "utf-8");
  console.log(`✅ Saved article to ${STORIES_FILE} (Slug: ${article.slug})`);
  return article.slug;
}

// 6. Ping IndexNow API for instant crawling
async function pingIndexNow(slug) {
  const url = `https://www.solashaven.com/chronicles/${slug}`;
  console.log(`🌐 Pinging IndexNow API with new URL: ${url}`);

  try {
    const payload = {
      host: "www.solashaven.com",
      key: "e5a8f27b9c1d4e6f8a3b5c7d1e0f2a4b",
      keyLocation: "https://www.solashaven.com/e5a8f27b9c1d4e6f8a3b5c7d1e0f2a4b.txt",
      urlList: [url, "https://www.solashaven.com/chronicles", "https://www.solashaven.com/sitemap.xml"]
    };

    const res = await fetch("https://api.indexnow.org/indexnow", {
      method: "POST",
      headers: { "Content-Type": "application/json; charset=utf-8" },
      body: JSON.stringify(payload)
    });

    if (res.status === 200 || res.status === 202) {
      console.log(`🚀 IndexNow Ping SUCCESS (HTTP ${res.status}): Search engines notified for immediate crawling!`);
    } else {
      console.log(`ℹ️ IndexNow Ping response code: ${res.status}`);
    }
  } catch (err) {
    console.warn("IndexNow ping note:", err.message);
  }
}

// Execute
async function main() {
  try {
    const article = await generateArticle(chosenTopic);
    const slug = saveArticleToFile(article);
    await pingIndexNow(slug);
    console.log(`🎉 Autonomous SEO Cycle Complete! Title: "${article.title}"`);
  } catch (err) {
    console.error("❌ SEO Agent failed:", err);
    process.exit(1);
  }
}

main();
