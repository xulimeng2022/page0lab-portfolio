// 站点资料集中维护入口：文案、链接、文章与项目信息都从这里读取。
export const siteData = {
  name: "序川",
  title: "序川｜用 AI 做真正用得上的工具",
  description:
    "序川的个人作品站，记录 Android 应用、Obsidian 工作流、多 Agent 开发与学习实践。",
  productionUrl: "https://xulimeng2022.github.io/seqriver-portfolio/",
  xUrl: "https://x.com/seqriver",
  avatar: {
    source: "./assets/avatar-source.png",
    web: "./assets/avatar-720.jpg",
    thumb: "./assets/avatar-256.jpg",
    alt: "序川的 Q 版人物头像，深蓝头发、奶白外套，背景是青绿山川与河流",
  },
  hero: {
    eyebrow: "AI · 编程 · 自动化",
    lead: "用 AI 做点自己真正用得上的东西。",
    intro: "在读大学生，记录 App、Agent 协作和学习工作流的实践。",
  },
  about: {
    paragraphs: [
      "我更喜欢从自己的真实需求出发。遇到重复、混乱或麻烦的事，就试着用 AI 和代码做一个小工具。",
      "这个站点用来放我正在做和已经做出来的东西，也记录过程中的取舍、失败和下一步。",
      "如果你也在折腾 AI、自动化或开发工作流，欢迎在 X 上继续交流。",
    ],
    tags: ["AI 辅助开发", "Android App", "多 Agent", "自动化", "学习工作流"],
  },
  // 没有已发布文章时保持空数组，构建结果会整体隐藏“记录”栏目和导航项。
  records: [],
  projects: [
    {
      id: "storage",
      index: "01",
      name: "智能收纳助手",
      kicker: "Android 应用",
      summary: "用文字、键盘语音和照片记录物品放在哪里，需要时再快速找回来。",
      status: "v1.2.0 已发布",
      facts: ["Android 8.0+", "本地优先", "AI 可选增强"],
      points: [
        "一句话可以描述多件物品，再由 AI 提取名称、地点和备注，确认后保存。",
        "物品、照片和视觉索引优先留在手机中，AI 失败时仍能完成普通记录。",
        "照片分析一次后形成本地可搜索索引，需要时再手动复核候选图片。",
      ],
      process:
        "项目已经完成 v1.2.0 的发布记录和连续版本迭代。发布后的少数体验返修仍在补齐逐项真机证据，因此这里分别说明“版本已发布”和“测试范围”，不用一个状态概括全部。",
      limitations:
        "AI 图片理解默认关闭，首次使用需要配置可用的模型服务；不同设备和模型服务之间仍可能存在实际差异。",
      media: {
        type: "screenshot-group",
        label: "真实界面截图",
        items: [
          {
            src: "./assets/storage-home.jpg",
            alt: "智能收纳助手物品列表界面",
          },
          {
            src: "./assets/storage-add.jpg",
            alt: "智能收纳助手添加物品和照片界面",
          },
          {
            src: "./assets/storage-ai.jpg",
            alt: "智能收纳助手 AI 图片理解与数据管理设置界面",
          },
        ],
      },
      links: {
        source: "https://github.com/xulimeng2022/SmartStorageAssistant",
        download: "",
        article: "",
      },
    },
    {
      id: "bridge",
      index: "02",
      name: "Obsidian Bridge",
      kicker: "个人知识工作流",
      summary:
        "连接电脑知识库与手机编辑：Google Docs 随手改，Obsidian 继续做唯一主库。",
      status: "已在实际学习记录中使用",
      facts: ["Obsidian 为主库", "Drive 中转", "Google Docs 编辑"],
      points: [
        "手机端的修改先进入 Inbox，再同步到本地 Obsidian 对应笔记。",
        "Obsidian 发生变化时可以生成反向刷新请求，让 Google Doc 跟上本地版本。",
        "使用哈希判断变化，冲突不直接覆盖；无法确定时进入人工确认区。",
      ],
      process:
        "2026-09-23 的真实记录中，多份笔记连续完成了手机端到本地、再反向刷新的处理，State、Registry 和完成回执保持一致。脚本、镜像、Mobile 与跨语言规范化测试均通过。",
      limitations:
        "流程依赖本机 PowerShell、Google Drive 和已配置的 Apps Script。5 分钟定时触发器是否正式启用仍需单独确认，因此这里不把它描述成已经验证的无值守服务。",
      media: {
        type: "concept-diagram",
        label: "概念示意",
      },
      links: {
        source: "",
        download: "",
        article: "",
      },
    },
    {
      id: "agents",
      index: "03",
      name: "多 Agent 开发实践",
      kicker: "开发实践",
      summary:
        "把开发拆给 Coordinator、UI、AI、Data 四个角色，各自在独立 worktree 工作，再由主控整合。",
      status: "已在真实项目中持续迭代",
      facts: ["Coordinator", "独立 worktree", "Single Writer"],
      points: [
        "Coordinator 负责拆任务、划边界、接收结果、安排验证与最终整合。",
        "UI、AI、Data 只修改各自负责的模块，并提交实现、diff 和验证证据。",
        "共享文件使用单一写入者，相关角色按顺序修改，减少互相覆盖。",
      ],
      process:
        "这套流程来自智能收纳助手的真实协作记录：角色拥有长期工作区，但任务仍需经过任务卡、提交、测试和 Review 完成交接。",
      limitations:
        "独立 worktree 只能减少互相覆盖，不会自动消除接口冲突、共享文件竞争和集成错误；合并、发布与高风险操作仍需明确授权。",
      media: {
        type: "workflow-image",
        label: "实践流程图",
        src: "./assets/agents-workflow.jpg",
        alt: "Coordinator 与 UI、AI、Data 工作树协作及验证整合流程图",
      },
      links: {
        source: "",
        download: "",
        article: "",
      },
    },
  ],
};



