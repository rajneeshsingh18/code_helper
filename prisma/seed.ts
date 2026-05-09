import { PrismaClient } from "@prisma/client";
import bcrypt from "bcryptjs";

const prisma = new PrismaClient();

async function main() {
  console.log("Seeding database...");

  const hashedPassword = await bcrypt.hash("password123", 12);

  const admin = await prisma.user.upsert({
    where: { email: "admin@example.com" },
    update: {},
    create: {
      email: "admin@example.com",
      name: "Admin",
      password: hashedPassword,
      role: "admin",
    },
  });
  console.log("Created admin user:", admin.email);

  const topics = await Promise.all([
    prisma.topic.upsert({
      where: { slug: "arrays" },
      update: {},
      create: { name: "Arrays", slug: "arrays" },
    }),
    prisma.topic.upsert({
      where: { slug: "strings" },
      update: {},
      create: { name: "Strings", slug: "strings" },
    }),
    prisma.topic.upsert({
      where: { slug: "linked-list" },
      update: {},
      create: { name: "Linked List", slug: "linked-list" },
    }),
    prisma.topic.upsert({
      where: { slug: "trees" },
      update: {},
      create: { name: "Trees", slug: "trees" },
    }),
    prisma.topic.upsert({
      where: { slug: "dynamic-programming" },
      update: {},
      create: { name: "Dynamic Programming", slug: "dynamic-programming" },
    }),
    prisma.topic.upsert({
      where: { slug: "graphs" },
      update: {},
      create: { name: "Graphs", slug: "graphs" },
    }),
    prisma.topic.upsert({
      where: { slug: "sorting" },
      update: {},
      create: { name: "Sorting", slug: "sorting" },
    }),
    prisma.topic.upsert({
      where: { slug: "binary-search" },
      update: {},
      create: { name: "Binary Search", slug: "binary-search" },
    }),
  ]);
  console.log("Created topics:", topics.map((t) => t.name).join(", "));

  const topicMap = new Map(topics.map((t) => [t.slug, t]));

  const problems = [
    {
      title: "Two Sum",
      slug: "two-sum",
      difficulty: "Easy" as const,
      description: "Given an array of integers `nums` and an integer `target`, return indices of the two numbers such that they add up to `target`.",
      examples: JSON.stringify([
        { input: "[2,7,11,15], 9", output: "[0,1]", explanation: "Because nums[0] + nums[1] == 9, we return [0, 1]." },
        { input: "[3,2,4], 6", output: "[1,2]", explanation: "" },
        { input: "[3,3], 6", output: "[0,1]", explanation: "" }
      ]),
      constraints: JSON.stringify([
        "2 <= nums.length <= 10^4",
        "-10^9 <= nums[i] <= 10^9",
        "-10^9 <= target <= 10^9",
        "Only one valid answer exists."
      ]),
      testCases: JSON.stringify([
        { input: { nums: [2, 7, 11, 15], target: 9 }, expected: [0, 1] },
        { input: { nums: [3, 2, 4], target: 6 }, expected: [1, 2] }
      ]),
      starterCode: `function twoSum(nums, target) {
  // Write your code here
  
}`,
      solution: `function twoSum(nums, target) {
  const map = new Map();
  for (let i = 0; i < nums.length; i++) {
    const complement = target - nums[i];
    if (map.has(complement)) {
      return [map.get(complement), i];
    }
    map.set(nums[i], i);
  }
  return [];
}`,
      topics: ["arrays", "hash-table"],
      videoUrl: "https://www.youtube.com/watch?v=XL8f6vV2G2U",
    },
    {
      title: "Valid Parentheses",
      slug: "valid-parentheses",
      difficulty: "Easy" as const,
      description: "Given a string s containing just the characters '(', ')', '{', '}', '[' and ']', determine if the input string is valid.",
      examples: JSON.stringify([
        { input: "()", output: "true", explanation: "" },
        { input: "()[]{}", output: "true", explanation: "" },
        { input: "(]", output: "false", explanation: "" }
      ]),
      constraints: JSON.stringify([
        "1 <= s.length <= 10^4",
        "s consists of parentheses only '()[]{}'"
      ]),
      testCases: JSON.stringify([
        { input: { s: "()" }, expected: true },
        { input: { s: "()[]{}" }, expected: true },
        { input: { s: "(]" }, expected: false }
      ]),
      starterCode: `function isValid(s) {
  // Write your code here
  
}`,
      solution: `function isValid(s) {
  const stack = [];
  const map = { ')': '(', '}': '{', ']': '[' };
  for (const char of s) {
    if (char in map) {
      if (stack.pop() !== map[char]) return false;
    } else {
      stack.push(char);
    }
  }
  return stack.length === 0;
}`,
      topics: ["strings", "stack"],
      videoUrl: "",
    },
    {
      title: "Merge Two Sorted Lists",
      slug: "merge-two-sorted-lists",
      difficulty: "Easy" as const,
      description: "You are given the heads of two sorted linked lists list1 and list2. Merge the two lists into one sorted list.",
      examples: JSON.stringify([
        { input: "[1,2,4], [1,3,4]", output: "[1,1,2,3,4,4]", explanation: "" },
        { input: "[], []", output: "[]", explanation: "" },
        { input: "[], [0]", output: "[0]", explanation: "" }
      ]),
      constraints: JSON.stringify([
        "The number of nodes in both lists is in the range [0, 50].",
        "-100 <= Node.val <= 100",
        "Both list1 and list2 are sorted in non-decreasing order."
      ]),
      testCases: JSON.stringify([]),
      starterCode: `function mergeTwoLists(list1, list2) {
  // Write your code here
  
}`,
      solution: `function mergeTwoLists(l1, l2) {
  const dummy = { next: null };
  let current = dummy;
  while (l1 && l2) {
    if (l1.val <= l2.val) {
      current.next = l1;
      l1 = l1.next;
    } else {
      current.next = l2;
      l2 = l2.next;
    }
    current = current.next;
  }
  current.next = l1 || l2;
  return dummy.next;
}`,
      topics: ["linked-list", "recursion"],
      videoUrl: "",
    },
    {
      title: "Maximum Subarray",
      slug: "maximum-subarray",
      difficulty: "Medium" as const,
      description: "Given an integer array nums, find the subarray with the largest sum, and return its sum.",
      examples: JSON.stringify([
        { input: "[-2,1,-3,4,-1,2,1,-5,4]", output: "6", explanation: "The subarray [4,-1,2,1] has the largest sum 6." },
        { input: "[1]", output: "1", explanation: "The subarray [1] has the largest sum 1." },
        { input: "[5,4,-1,7,8]", output: "23", explanation: "" }
      ]),
      constraints: JSON.stringify([
        "1 <= nums.length <= 10^5",
        "-10^4 <= nums[i] <= 10^4"
      ]),
      testCases: JSON.stringify([]),
      starterCode: `function maxSubArray(nums) {
  // Write your code here
  
}`,
      solution: `function maxSubArray(nums) {
  let maxSum = nums[0];
  let currentSum = nums[0];
  for (let i = 1; i < nums.length; i++) {
    currentSum = Math.max(nums[i], currentSum + nums[i]);
    maxSum = Math.max(maxSum, currentSum);
  }
  return maxSum;
}`,
      topics: ["arrays", "dynamic-programming"],
      videoUrl: "",
    },
    {
      title: "Binary Search",
      slug: "binary-search",
      difficulty: "Easy" as const,
      description: "Given an array of integers nums which is sorted in ascending order, and an integer target, write a function to search target in nums.",
      examples: JSON.stringify([
        { input: "[-1,0,3,5,9,12], 9", output: "4", explanation: "9 exists in nums and its index is 4" },
        { input: "[-1,0,3,5,9,12], 2", output: "-1", explanation: "2 does not exist in nums so return -1" }
      ]),
      constraints: JSON.stringify([
        "1 <= nums.length <= 10^4",
        "-10^4 < nums[i], target < 10^4",
        "All integers in nums are unique.",
        "nums is sorted in ascending order."
      ]),
      testCases: JSON.stringify([]),
      starterCode: `function search(nums, target) {
  // Write your code here
  
}`,
      solution: `function search(nums, target) {
  let left = 0, right = nums.length - 1;
  while (left <= right) {
    const mid = Math.floor((left + right) / 2);
    if (nums[mid] === target) return mid;
    else if (nums[mid] < target) left = mid + 1;
    else right = mid - 1;
  }
  return -1;
}`,
      topics: ["arrays", "binary-search"],
      videoUrl: "",
    },
  ];

  for (const problem of problems) {
    const { topics: topicSlugs, ...problemData } = problem;
    const topicIds = topicSlugs
      .map((slug) => topicMap.get(slug)?.id)
      .filter(Boolean) as string[];

    await prisma.problem.upsert({
      where: { slug: problem.slug },
      update: {},
      create: {
        ...problemData,
        topics: {
          connect: topicIds.map((id) => ({ id })),
        },
      },
    });
  }
  console.log("Created problems:", problems.length);

  const sheets = [
    {
      name: "Blind 75",
      slug: "blind-75",
      description: "Most frequently asked questions in tech interviews",
    },
    {
      name: "Top 150 LeetCode",
      slug: "top-150",
      description: "Curated list of top LeetCode problems",
    },
    {
      name: "Array Problems",
      slug: "array-problems",
      description: "Master array manipulation and algorithms",
    },
  ];

  for (const sheet of sheets) {
    await prisma.topicSheet.upsert({
      where: { slug: sheet.slug },
      update: {},
      create: {
        name: sheet.name,
        slug: sheet.slug,
        description: sheet.description,
      },
    });
  }
  console.log("Created sheets:", sheets.length);

  console.log("Seeding completed!");
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });