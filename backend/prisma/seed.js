require("dotenv").config();

const prisma = require("../src/lib/prisma");

const SYSTEM_USER = "system";


// =====================================================
// FIND OR CREATE QUESTION
// =====================================================

const findOrCreateQuestion = async ({
    title,
    description,
    constraints,
    questionType,
    difficulty,
    status,
    categoryId
}) => {

    const existingQuestion =
        await prisma.question.findFirst({
            where: {
                title
            }
        });

    if (existingQuestion) {
        return prisma.question.update({
            where: {
                id: existingQuestion.id
            },

            data: {
                description,
                constraints,
                questionType,
                difficulty,
                status,
                categoryId,
                updatedBy: SYSTEM_USER
            }
        });
    }

    return prisma.question.create({
        data: {
            title,
            description,
            constraints,
            questionType,
            difficulty,
            status,
            categoryId,
            createdBy: SYSTEM_USER,
            updatedBy: SYSTEM_USER
        }
    });
};


// =====================================================
// SYNCHRONIZE QUESTION TAGS
// =====================================================

const syncQuestionTags = async (
    questionId,
    tagIds
) => {

    const existingTags =
        await prisma.questionTag.findMany({
            where: {
                questionId
            },

            select: {
                tagId: true
            }
        });

    const existingTagIds =
        existingTags.map(
            (item) => item.tagId
        );


    const tagsToRemove =
        existingTagIds.filter(
            (tagId) => !tagIds.includes(tagId)
        );


    const tagsToAdd =
        tagIds.filter(
            (tagId) =>
                !existingTagIds.includes(tagId)
        );


    if (tagsToRemove.length) {
        await prisma.questionTag.deleteMany({
            where: {
                questionId,

                tagId: {
                    in: tagsToRemove
                }
            }
        });
    }


    if (tagsToAdd.length) {
        await prisma.questionTag.createMany({
            data: tagsToAdd.map(
                (tagId) => ({
                    questionId,
                    tagId
                })
            )
        });
    }
};


// =====================================================
// SYNCHRONIZE QUESTION LANGUAGES
// =====================================================

const syncQuestionLanguages = async (
    questionId,
    languages
) => {

    const existingLanguages =
        await prisma.questionLanguage.findMany({
            where: {
                questionId
            },

            select: {
                languageId: true
            }
        });


    const existingLanguageIds =
        existingLanguages.map(
            (item) => item.languageId
        );


    const requestedLanguageIds =
        languages.map(
            (item) => item.languageId
        );


    const languagesToRemove =
        existingLanguageIds.filter(
            (languageId) =>
                !requestedLanguageIds.includes(
                    languageId
                )
        );


    if (languagesToRemove.length) {
        await prisma.questionLanguage.deleteMany({
            where: {
                questionId,

                languageId: {
                    in: languagesToRemove
                }
            }
        });
    }


    for (const item of languages) {

        await prisma.questionLanguage.upsert({
            where: {
                questionId_languageId: {
                    questionId,
                    languageId:
                        item.languageId
                }
            },

            update: {
                starterCode:
                    item.starterCode
            },

            create: {
                questionId,
                languageId:
                    item.languageId,

                starterCode:
                    item.starterCode
            }
        });
    }
};


// =====================================================
// SYNCHRONIZE CODING CONFIG
// =====================================================

const syncCodingConfig = async (
    questionId
) => {

    await prisma.codingQuestionConfig.upsert({
        where: {
            questionId
        },

        update: {
            executionMode:
                "STDIN_STDOUT",

            timeLimitMs:
                2000,

            memoryLimitMb:
                256
        },

        create: {
            questionId,

            executionMode:
                "STDIN_STDOUT",

            timeLimitMs:
                2000,

            memoryLimitMb:
                256
        }
    });
};


// =====================================================
// SYNCHRONIZE TEST CASES
// =====================================================

const syncTestCases = async (
    questionId,
    testCases
) => {

    const existingTestCases =
        await prisma.testCase.findMany({
            where: {
                questionId
            },

            select: {
                displayOrder: true
            }
        });


    const existingOrders =
        existingTestCases.map(
            (item) => item.displayOrder
        );


    const requestedOrders =
        testCases.map(
            (item) => item.displayOrder
        );


    const testCasesToRemove =
        existingOrders.filter(
            (order) =>
                !requestedOrders.includes(order)
        );


    if (testCasesToRemove.length) {
        await prisma.testCase.deleteMany({
            where: {
                questionId,

                displayOrder: {
                    in: testCasesToRemove
                }
            }
        });
    }


    for (const testCase of testCases) {

        await prisma.testCase.upsert({
            where: {
                questionId_displayOrder: {
                    questionId,

                    displayOrder:
                        testCase.displayOrder
                }
            },

            update: {
                input:
                    testCase.input,

                expectedOutput:
                    testCase.expectedOutput,

                explanation:
                    testCase.explanation,

                isSample:
                    testCase.isSample,

                points:
                    testCase.points
            },

            create: {
                questionId,

                input:
                    testCase.input,

                expectedOutput:
                    testCase.expectedOutput,

                explanation:
                    testCase.explanation,

                isSample:
                    testCase.isSample,

                points:
                    testCase.points,

                displayOrder:
                    testCase.displayOrder
            }
        });
    }
};


// =====================================================
// SEED CODING QUESTION
// =====================================================

const seedCodingQuestion = async ({
    title,
    description,
    constraints,
    difficulty,
    categoryId,
    tagIds,
    languages,
    testCases
}) => {

    // ---------------------------------------------
    // CREATE / UPDATE QUESTION
    // ---------------------------------------------

    const question =
        await findOrCreateQuestion({
            title,
            description,
            constraints,

            questionType:
                "CODING",

            difficulty,

            status:
                "PUBLISHED",

            categoryId
        });


    // ---------------------------------------------
    // TAGS
    // ---------------------------------------------

    await syncQuestionTags(
        question.id,
        tagIds
    );


    // ---------------------------------------------
    // LANGUAGES
    // ---------------------------------------------

    await syncQuestionLanguages(
        question.id,
        languages
    );


    // ---------------------------------------------
    // CODING CONFIG
    // ---------------------------------------------

    await syncCodingConfig(
        question.id
    );


    // ---------------------------------------------
    // TEST CASES
    // ---------------------------------------------

    await syncTestCases(
        question.id,
        testCases
    );


    console.log(
        `Seeded question: ${title}`
    );
};


// =====================================================
// MAIN SEED
// =====================================================

const seed = async () => {

    try {

        // ==========================================
        // CATEGORIES
        // ==========================================

        const categories = [
            {
                name: "Algorithms",
                description:
                    "Questions focused on algorithms and problem solving",
                status: "ACTIVE"
            },

            {
                name: "Data Structures",
                description:
                    "Questions focused on data structures",
                status: "ACTIVE"
            },

            {
                name: "Dynamic Programming",
                description:
                    "Questions involving optimization using dynamic programming",
                status: "ACTIVE"
            }
        ];


        for (const category of categories) {

            await prisma.category.upsert({
                where: {
                    name: category.name
                },

                update: {
                    description:
                        category.description,

                    status:
                        category.status,

                    updatedBy:
                        SYSTEM_USER
                },

                create: {
                    ...category,

                    createdBy:
                        SYSTEM_USER,

                    updatedBy:
                        SYSTEM_USER
                }
            });
        }


        // ==========================================
        // TAGS
        // ==========================================

        const tags = [
            {
                name: "Array",
                description:
                    "Questions involving arrays",
                status: "ACTIVE"
            },

            {
                name: "Hashing",
                description:
                    "Questions involving hash maps and hash sets",
                status: "ACTIVE"
            },

            {
                name: "String",
                description:
                    "Questions involving string manipulation",
                status: "ACTIVE"
            },

            {
                name: "Two Pointers",
                description:
                    "Questions solved using the two pointers technique",
                status: "ACTIVE"
            },

            {
                name: "Sliding Window",
                description:
                    "Questions solved using the sliding window technique",
                status: "ACTIVE"
            },

            {
                name: "Binary Search",
                description:
                    "Questions solved using binary search",
                status: "ACTIVE"
            }
        ];


        for (const tag of tags) {

            await prisma.tag.upsert({
                where: {
                    name: tag.name
                },

                update: {
                    description:
                        tag.description,

                    status:
                        tag.status,

                    updatedBy:
                        SYSTEM_USER
                },

                create: {
                    ...tag,

                    createdBy:
                        SYSTEM_USER,

                    updatedBy:
                        SYSTEM_USER
                }
            });
        }


        // ==========================================
        // LANGUAGES
        // ==========================================

        const languages = [
            {
                name: "Java",
                code: "java",
                status: "ACTIVE"
            },

            {
                name: "Python",
                code: "python",
                status: "ACTIVE"
            },

            {
                name: "JavaScript",
                code: "javascript",
                status: "ACTIVE"
            },

            {
                name: "C++",
                code: "cpp",
                status: "ACTIVE"
            }
        ];


        for (const language of languages) {

            await prisma.language.upsert({
                where: {
                    code: language.code
                },

                update: {
                    name:
                        language.name,

                    status:
                        language.status
                },

                create: {
                    ...language
                }
            });
        }


        // ==========================================
        // LOAD CATEGORIES
        // ==========================================

        const [
            algorithmsCategory,
            dataStructuresCategory,
            dynamicProgrammingCategory
        ] = await Promise.all([

            prisma.category.findUnique({
                where: {
                    name: "Algorithms"
                }
            }),

            prisma.category.findUnique({
                where: {
                    name: "Data Structures"
                }
            }),

            prisma.category.findUnique({
                where: {
                    name: "Dynamic Programming"
                }
            })
        ]);


        // ==========================================
        // LOAD TAGS
        // ==========================================

        const seededTags =
            await prisma.tag.findMany({
                where: {
                    name: {
                        in:
                            tags.map(
                                (tag) => tag.name
                            )
                    }
                }
            });


        const tagsByName = {};

        for (const tag of seededTags) {
            tagsByName[tag.name] = tag;
        }


        // ==========================================
        // LOAD LANGUAGES
        // ==========================================

        const seededLanguages =
            await prisma.language.findMany({
                where: {
                    code: {
                        in:
                            languages.map(
                                (language) =>
                                    language.code
                            )
                    }
                }
            });


        const languagesByCode = {};

        for (const language of seededLanguages) {
            languagesByCode[
                language.code
            ] = language;
        }


        // ==========================================
        // VALIDATE LOOKUPS
        // ==========================================

        if (
            !algorithmsCategory ||
            !dataStructuresCategory ||
            !dynamicProgrammingCategory
        ) {
            throw new Error(
                "Failed to load seeded categories"
            );
        }


        if (
            !tagsByName["Array"] ||
            !tagsByName["Hashing"] ||
            !tagsByName["String"] ||
            !tagsByName["Two Pointers"] ||
            !tagsByName["Sliding Window"] ||
            !tagsByName["Binary Search"]
        ) {
            throw new Error(
                "Failed to load seeded tags"
            );
        }


        if (
            !languagesByCode["java"] ||
            !languagesByCode["python"] ||
            !languagesByCode["javascript"] ||
            !languagesByCode["cpp"]
        ) {
            throw new Error(
                "Failed to load seeded languages"
            );
        }


        // ==========================================
        // COMMON LANGUAGE STARTER CODES
        // ==========================================

        const defaultLanguages = [

            {
                languageId:
                    languagesByCode["java"].id,

                starterCode:
`import java.io.*;
import java.util.*;

public class Main {
    public static void main(String[] args) throws Exception {

    }
}`
            },

            {
                languageId:
                    languagesByCode["python"].id,

                starterCode:
`import sys

def solve():

    pass


if __name__ == "__main__":
    solve()`
            },

            {
                languageId:
                    languagesByCode[
                        "javascript"
                    ].id,

                starterCode:
`const fs = require("fs");

function solve() {

}

solve();`
            },

            {
                languageId:
                    languagesByCode["cpp"].id,

                starterCode:
`#include <bits/stdc++.h>

using namespace std;

int main() {

    return 0;
}`
            }
        ];


        // ==========================================
        // QUESTION 1 - TWO SUM
        // ==========================================

        await seedCodingQuestion({

            title:
                "Two Sum",

            description:
                "Given an array of integers and a target value, print the indices of two distinct elements whose sum equals the target.",

            constraints:
                "2 <= n <= 100000",

            difficulty:
                "EASY",

            categoryId:
                algorithmsCategory.id,

            tagIds: [
                tagsByName["Array"].id,
                tagsByName["Hashing"].id
            ],

            languages:
                defaultLanguages,

            testCases: [

                {
                    input:
`4
2 7 11 15
9`,

                    expectedOutput:
`0 1`,

                    explanation:
                        "nums[0] + nums[1] equals 9.",

                    isSample:
                        true,

                    points:
                        0,

                    displayOrder:
                        1
                },

                {
                    input:
`3
3 2 4
6`,

                    expectedOutput:
`1 2`,

                    explanation:
                        "nums[1] + nums[2] equals 6.",

                    isSample:
                        true,

                    points:
                        0,

                    displayOrder:
                        2
                },

                {
                    input:
`2
3 3
6`,

                    expectedOutput:
`0 1`,

                    explanation:
                        null,

                    isSample:
                        false,

                    points:
                        10,

                    displayOrder:
                        3
                },

                {
                    input:
`5
1 5 3 7 9
12`,

                    expectedOutput:
`1 3`,

                    explanation:
                        null,

                    isSample:
                        false,

                    points:
                        10,

                    displayOrder:
                        4
                }
            ]
        });


        // ==========================================
        // QUESTION 2 - VALID ANAGRAM
        // ==========================================

        await seedCodingQuestion({

            title:
                "Valid Anagram",

            description:
                "Given two strings, determine whether they are anagrams of each other.",

            constraints:
                "1 <= string length <= 100000",

            difficulty:
                "EASY",

            categoryId:
                algorithmsCategory.id,

            tagIds: [
                tagsByName["String"].id,
                tagsByName["Hashing"].id
            ],

            languages:
                defaultLanguages,

            testCases: [

                {
                    input:
`anagram
nagaram`,

                    expectedOutput:
`true`,

                    explanation:
                        "Both strings contain the same characters with the same frequencies.",

                    isSample:
                        true,

                    points:
                        0,

                    displayOrder:
                        1
                },

                {
                    input:
`rat
car`,

                    expectedOutput:
`false`,

                    explanation:
                        "The character frequencies are different.",

                    isSample:
                        true,

                    points:
                        0,

                    displayOrder:
                        2
                },

                {
                    input:
`listen
silent`,

                    expectedOutput:
`true`,

                    explanation:
                        null,

                    isSample:
                        false,

                    points:
                        10,

                    displayOrder:
                        3
                },

                {
                    input:
`hello
world`,

                    expectedOutput:
`false`,

                    explanation:
                        null,

                    isSample:
                        false,

                    points:
                        10,

                    displayOrder:
                        4
                }
            ]
        });


        // ==========================================
        // QUESTION 3 - CONTAINER WITH MOST WATER
        // ==========================================

        await seedCodingQuestion({

            title:
                "Container With Most Water",

            description:
                "Given an array of heights, find the maximum amount of water that can be contained between two vertical lines.",

            constraints:
                "2 <= n <= 100000",

            difficulty:
                "MEDIUM",

            categoryId:
                algorithmsCategory.id,

            tagIds: [
                tagsByName["Array"].id,
                tagsByName["Two Pointers"].id
            ],

            languages:
                defaultLanguages,

            testCases: [

                {
                    input:
`9
1 8 6 2 5 4 8 3 7`,

                    expectedOutput:
`49`,

                    explanation:
                        "The maximum area is formed by heights 8 and 7.",

                    isSample:
                        true,

                    points:
                        0,

                    displayOrder:
                        1
                },

                {
                    input:
`2
1 1`,

                    expectedOutput:
`1`,

                    explanation:
                        "Only one container can be formed.",

                    isSample:
                        true,

                    points:
                        0,

                    displayOrder:
                        2
                },

                {
                    input:
`5
4 3 2 1 4`,

                    expectedOutput:
`16`,

                    explanation:
                        null,

                    isSample:
                        false,

                    points:
                        10,

                    displayOrder:
                        3
                },

                {
                    input:
`6
1 2 1 3 4 2`,

                    expectedOutput:
`6`,

                    explanation:
                        null,

                    isSample:
                        false,

                    points:
                        10,

                    displayOrder:
                        4
                }
            ]
        });


        // ==========================================
        // QUESTION 4 - LONGEST SUBSTRING
        // ==========================================

        await seedCodingQuestion({

            title:
                "Longest Substring Without Repeating Characters",

            description:
                "Given a string, find the length of the longest substring that contains no repeating characters.",

            constraints:
                "0 <= string length <= 100000",

            difficulty:
                "MEDIUM",

            categoryId:
                algorithmsCategory.id,

            tagIds: [
                tagsByName["String"].id,
                tagsByName["Sliding Window"].id
            ],

            languages:
                defaultLanguages,

            testCases: [

                {
                    input:
`abcabcbb`,

                    expectedOutput:
`3`,

                    explanation:
                        "The longest substring is abc.",

                    isSample:
                        true,

                    points:
                        0,

                    displayOrder:
                        1
                },

                {
                    input:
`bbbbb`,

                    expectedOutput:
`1`,

                    explanation:
                        "The longest substring is b.",

                    isSample:
                        true,

                    points:
                        0,

                    displayOrder:
                        2
                },

                {
                    input:
`pwwkew`,

                    expectedOutput:
`3`,

                    explanation:
                        null,

                    isSample:
                        false,

                    points:
                        10,

                    displayOrder:
                        3
                },

                {
                    input:
``,

                    expectedOutput:
`0`,

                    explanation:
                        null,

                    isSample:
                        false,

                    points:
                        10,

                    displayOrder:
                        4
                }
            ]
        });


        // ==========================================
        // QUESTION 5 - BINARY SEARCH
        // ==========================================

        await seedCodingQuestion({

            title:
                "Binary Search",

            description:
                "Given a sorted array and a target value, return the index of the target. Return -1 if the target does not exist.",

            constraints:
                "1 <= n <= 100000",

            difficulty:
                "EASY",

            categoryId:
                algorithmsCategory.id,

            tagIds: [
                tagsByName["Array"].id,
                tagsByName["Binary Search"].id
            ],

            languages:
                defaultLanguages,

            testCases: [

                {
                    input:
`6
-1 0 3 5 9 12
9`,

                    expectedOutput:
`4`,

                    explanation:
                        "The target 9 is located at index 4.",

                    isSample:
                        true,

                    points:
                        0,

                    displayOrder:
                        1
                },

                {
                    input:
`6
-1 0 3 5 9 12
2`,

                    expectedOutput:
`-1`,

                    explanation:
                        "The target does not exist in the array.",

                    isSample:
                        true,

                    points:
                        0,

                    displayOrder:
                        2
                },

                {
                    input:
`1
5
5`,

                    expectedOutput:
`0`,

                    explanation:
                        null,

                    isSample:
                        false,

                    points:
                        10,

                    displayOrder:
                        3
                },

                {
                    input:
`5
1 3 5 7 9
1`,

                    expectedOutput:
`0`,

                    explanation:
                        null,

                    isSample:
                        false,

                    points:
                        10,

                    displayOrder:
                        4
                }
            ]
        });


        // ==========================================
        // SUCCESS
        // ==========================================

        console.log(
            "\n======================================"
        );

        console.log(
            "Database seeded successfully"
        );

        console.log(
            "Categories: 3"
        );

        console.log(
            "Tags: 6"
        );

        console.log(
            "Languages: 4"
        );

        console.log(
            "Coding Questions: 5"
        );

        console.log(
            "======================================\n"
        );

    } catch (error) {

        console.error(
            "Seed failed:",
            error
        );

        process.exitCode = 1;

    } finally {

        await prisma.$disconnect();
    }
};


seed();