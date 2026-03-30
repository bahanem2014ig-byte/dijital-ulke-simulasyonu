const posts = [
    {
        id: 1,
        text: "The invention of writing has changed how we communicate!" ,
        mentions: ["@sumerianWriter", "@egyptianScribe"],
        parentId: null,
        event: "Writing's Invention"
    },
    {
        id: 2,
        text: "The Industrial Revolution brought us new machines that transformed our cities!", 
        mentions: ["@factoryWorker", "@inventorSmith"],
        parentId: null,
        event: "Industrial Revolution"
    },
    {
        id: 3,
        text: "Technology is evolving at a pace we’ve never seen before!", 
        mentions: ["@techGuru", "@futuristJane"],
        parentId: null,
        event: "Technology Rise"
    },
    {
        id: 4,
        text: "Freedom struggles have defined our history and shaped societies.",
        mentions: ["@activistBob", "@historianLara"],
        parentId: null,
        event: "Freedom Struggles"
    },
    {
        id: 5,
        text: "Climate crisis demands immediate action from all generations!", 
        mentions: ["@environmentalistTom", "@youthLeaderSara"],
        parentId: null,
        event: "Climate Crisis"
    },
    // Replies
    {
        id: 6,
        text: "Absolutely! It was such a groundbreaking moment in history!",
        mentions: ["@sumerianWriter"],
        parentId: 1,
        event: "Writing's Invention"
    },
    {
        id: 7,
        text: "Yes, and it laid the foundation for modern communication!",
        mentions: ["@egyptianScribe"],
        parentId: 1,
        event: "Writing's Invention"
    },
    {
        id: 8,
        text: "Machines changed everything for us workers who toiled day and night!",
        mentions: ["@factoryWorker"],
        parentId: 2,
        event: "Industrial Revolution"
    },
    {
        id: 9,
        text: "The inventions were a double-edged sword. We need to balance progress and humanity.",
        mentions: ["@inventorSmith"],
        parentId: 2,
        event: "Industrial Revolution"
    },
    {
        id: 10,
        text: "With every advancement, there are new responsibilities we must uphold!",
        mentions: ["@techGuru"],
        parentId: 3,
        event: "Technology Rise"
    },
    {
        id: 11,
        text: "Indeed, technology is rapidly changing our lives, but we must remain vigilant.",
        mentions: ["@futuristJane"],
        parentId: 3,
        event: "Technology Rise"
    },
    {
        id: 12,
        text: "Change is necessary, but freedom must be fought for day by day.",
        mentions: ["@activistBob"],
        parentId: 4,
        event: "Freedom Struggles"
    },
    {
        id: 13,
        text: "Let’s not forget the sacrifices made by those before us in this struggle.",
        mentions: ["@historianLara"],
        parentId: 4,
        event: "Freedom Struggles"
    },
    {
        id: 14,
        text: "We cannot ignore the crisis any longer, action must be taken!",
        mentions: ["@environmentalistTom"],
        parentId: 5,
        event: "Climate Crisis"
    },
    {
        id: 15,
        text: "The youth has a vital role in shaping a sustainable future.",
        mentions: ["@youthLeaderSara"],
        parentId: 5,
        event: "Climate Crisis"
    }
];

export default posts;