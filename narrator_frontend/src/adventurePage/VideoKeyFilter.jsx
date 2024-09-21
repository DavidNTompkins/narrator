export default function VideoKeyFilter(message, keyValueArray, priorMessage, guessedHallucinationStyles) {
    const filterWords = ["child", "kid", "toddler", "infant", "minor", "youngster", "juvenile", "adolescent", "teenager", "teen", "babe", "newborn", "offspring", "progeny", "youth", "schoolboy", "schoolgirl", "preteen", "little one", "baby", "nursling", "suckling", "neonate", "cherub", "whippersnapper", "tyke", "tot", "rugrat", "nipper", "moppet", "kiddo", "junior", "brat", "daughter", "step-daughter", "son", "step-son", "brother","sister","step-brother","step-sister", "kindergarten","preschool" ];
    function escapeRegExp(string) {
        return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
    }

    const emojiRegex = /[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{1F700}-\u{1F77F}\u{1F780}-\u{1F7FF}\u{1F800}-\u{1F8FF}\u{1F900}-\u{1F9FF}\u{1FA00}-\u{1FA6F}\u{1FA70}-\u{1FAFF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}\u{2B50}\u{2B55}\u{FE0F}]/gu;
    let modifiedMessage = message + priorMessage;
    modifiedMessage = modifiedMessage.replace(emojiRegex, '').trim();

    // Initialize a replacement tracker
    const replacementTracker = new Map();

    if (keyValueArray) {
        keyValueArray.forEach(({ key, value }) => {
            // Reset replacement tracker for each key-value pair
            replacementTracker.set(key, false);
            const keys = key.trim().replace(/,\s*$/, '').split(',').map(k => escapeRegExp(k.trim())).join('|');
            const regex = new RegExp(`\\b(${keys})([.,!?]*)\\b`, 'gi');
            modifiedMessage = modifiedMessage.replace(regex, (match, p1, p2) => {
                if (!replacementTracker.get(key)) {
                    replacementTracker.set(key, true);
                    return `${value}${p2}`;
                }
                return match; // Return the original match if replacement already done
            });
        });
    }

    if (guessedHallucinationStyles) {
        guessedHallucinationStyles.forEach(({ key, value }) => {
            // Assuming similar handling for guessedHallucinationStyles if needed
            const keys = key.split(',').map(k => escapeRegExp(k.trim())).join('|');
            const regex = new RegExp(`\\b(${keys})\\b`, 'gi');
            modifiedMessage = modifiedMessage.replace(regex, value);
        });
    }

    filterWords.forEach(word => {
        const wordRegex = new RegExp(`\\b${word}\\b`, 'gi');
        modifiedMessage = modifiedMessage.replace(wordRegex, '');
    });

    const generalStyleValue = keyValueArray ? keyValueArray.find(item => item.key === 'general_style')?.value || '' : '';
    const guessedStyleValue = guessedHallucinationStyles ? guessedHallucinationStyles.find(item => item.key === 'implied_style')?.value || '' : '';
    modifiedMessage += `. ${generalStyleValue}. ${guessedStyleValue}`;

    return modifiedMessage;
}
