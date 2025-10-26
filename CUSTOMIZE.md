# 自定义配置说明

本文档详细记录了导航页面中所有需要用户手动更改的部分，方便您根据实际需求进行个性化定制。

---

## 📝 基本信息修改

### 1. 页面标题和描述
**文件位置**：`index.html`

**需要修改的内容**：
```html
<!-- 第7-9行：SEO信息 -->
<meta name="description" content="这里可以修改页面描述">
<meta name="keywords" content="这里可以修改关键词">
<title>这里可以修改页面标题</title>
```

**建议**：
- description：简短描述网站功能（150字以内）
- keywords：添加相关的搜索关键词，用逗号分隔
- title：显示在浏览器标签上的名称

---

### 2. Logo和机构名称
**文件位置**：`index.html`

**需要修改的内容**：
```html
<!-- 第18-23行：Logo区域 -->
<div class="logo">
    <i class="fas fa-code"></i>        <!-- 这里可以更换图标 -->
    <span class="logo-text">1024</span> <!-- 这里可以修改Logo文字 -->
</div>
<h1 class="site-title">壹零贰肆少儿编程中心</h1> <!-- 修改机构全称 -->
```

**图标更换说明**：
- 使用 Font Awesome 图标库
- 访问 https://fontawesome.com/icons 查找图标
- 替换 `fa-code` 为其他图标名称
- 常用图标：`fa-graduation-cap`、`fa-rocket`、`fa-book`

---

### 3. 欢迎标语
**文件位置**：`index.html`

**需要修改的内容**：
```html
<!-- 第25行：标语 -->
<p class="tagline">开启编程之旅，从这里开始 🚀</p>
```

**建议标语**：
- "让每个孩子都能学会编程"
- "用代码创造未来"
- "编程点亮梦想"
- 可以添加emoji增加趣味性

---

## 🔗 链接地址修改

### 4. 平台网址
**文件位置**：`index.html`

**需要修改的内容**：
```html
<!-- 第40行：官网链接 -->
<a href="https://www.1024code.top" target="_blank" class="platform-card card-main">

<!-- 第52行：OJ平台链接 -->
<a href="https://oj.1024code.top" target="_blank" class="platform-card card-oj">

<!-- 第64行：博客链接 -->
<a href="https://blog.1024code.top" target="_blank" class="platform-card card-blog">
```

**注意事项**：
- 请确保网址包含 `http://` 或 `https://`
- `target="_blank"` 表示在新标签页打开
- 可以根据需要修改为 `target="_self"` 在当前页面打开

---

### 5. 平台描述文字
**文件位置**：`index.html`

**需要修改的内容**：
```html
<!-- 官网描述（第46行） -->
<p class="card-description">了解课程体系、师资力量、报名信息，开启孩子的编程启蒙之路</p>

<!-- OJ平台描述（第58行） -->
<p class="card-description">在线编程练习平台，海量题库助力学员提升编程能力，记录每一次进步</p>

<!-- 博客描述（第70行） -->
<p class="card-description">编程知识分享、学员作品展示、技术教程集锦，记录编程成长点滴</p>
```

**建议**：
- 描述应简洁明了，30-40字为宜
- 突出平台的核心功能和特色
- 使用亲切、易懂的语言

---

## 🌐 外部资源链接

### 6. 添加/删除/修改外部网站
**文件位置**：`index.html`

**修改示例**：
```html
<!-- 第104-109行：单个资源卡片 -->
<a href="网站地址" target="_blank" class="resource-card">
    <div class="resource-icon">💻</div>  <!-- 修改emoji图标 -->
    <h4>网站名称</h4>                      <!-- 修改名称 -->
    <p>网站简介</p>                        <!-- 修改描述 -->
</a>
```

**操作说明**：
- **添加网站**：复制整个 `<a class="resource-card">...</a>` 代码块，修改内容
- **删除网站**：删除对应的整个 `<a class="resource-card">...</a>` 代码块
- **修改顺序**：剪切并粘贴代码块到想要的位置

**Emoji图标推荐**：
- 💻 📚 🎓 🌐 📖 （学习类）
- 🐱 🎮 🐈 🐍 （编程语言）
- 🏆 💯 📝 🎯 （刷题类）
- 🐙 🦊 ⚡ 💬 （工具类）

---

### 7. 添加新的资源分类
**文件位置**：`index.html`

**操作步骤**：
1. 在 `<!-- 学习资源区域 -->` 下找到任意一个 `<div class="resource-category">` 代码块
2. 复制整个代码块（包括标题和所有卡片）
3. 粘贴到合适位置
4. 修改分类标题和图标
5. 修改或添加卡片内容

**示例代码**：
```html
<div class="resource-category">
    <h3 class="category-title">
        <i class="fas fa-lightbulb"></i>  <!-- 修改图标 -->
        新分类名称                          <!-- 修改标题 -->
    </h3>
    <div class="resource-grid">
        <!-- 在这里添加资源卡片 -->
    </div>
</div>
```

---

## 🎨 样式定制

### 8. 修改主题颜色
**文件位置**：`css/style.css`

**需要修改的内容**：
```css
/* 第10-22行：颜色变量 */
:root {
    --primary-color: #4A90E2;        /* 主色调（蓝色） */
    --secondary-color: #FF6B6B;      /* 次要色（红色） */
    --accent-orange: #FFA500;        /* 强调色（橙色） */
    --accent-green: #5CB85C;         /* 强调色（绿色） */
    --accent-purple: #9B59B6;        /* 强调色（紫色） */
}
```

**颜色修改建议**：
- 使用在线取色工具：https://colorhunt.co/
- 确保颜色对比度足够，保证可读性
- 建议保持色调统一，符合品牌形象

---

### 9. 修改背景渐变
**文件位置**：`css/style.css`

**需要修改的内容**：
```css
/* 第37行：页面背景渐变 */
background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
```

**渐变工具推荐**：
- https://cssgradient.io/
- https://uigradients.com/

---

### 10. 修改平台卡片渐变色
**文件位置**：`css/style.css`

**需要修改的内容**：
```css
/* 第180-188行：卡片渐变色 */
.card-main {
    background: linear-gradient(135deg, #4A90E2 0%, #357ABD 100%);
}

.card-oj {
    background: linear-gradient(135deg, #5CB85C 0%, #449D44 100%);
}

.card-blog {
    background: linear-gradient(135deg, #FF6B6B 0%, #E74C3C 100%);
}
```

---

## 📄 页脚信息

### 11. 版权和备案信息
**文件位置**：`index.html`

**需要修改的内容**：
```html
<!-- 第295-297行：页脚信息 -->
<p class="copyright">© 2025 壹零贰肆少儿编程中心 | 让每个孩子都能学会编程</p>
<p class="slogan">用代码创造未来 💡</p>
```

**建议**：
- 修改年份为当前年份
- 添加备案号（如需要）
- 可添加联系方式或地址

---

## 🖼️ 图片资源

### 12. 添加Logo图片
**操作说明**：
1. 准备Logo图片（建议PNG格式，透明背景）
2. 将图片放入 `images/` 文件夹，命名为 `logo.png`
3. 修改 `index.html` 中的Logo代码：

```html
<!-- 替换原有的图标Logo -->
<div class="logo">
    <img src="images/logo.png" alt="壹零贰肆Logo" style="height: 60px;">
</div>
```

---

## 📱 高级定制

### 13. 添加网站图标（Favicon）
**操作步骤**：
1. 准备 favicon.ico 文件（16x16或32x32像素）
2. 放在项目根目录
3. 在 `index.html` 的 `<head>` 中添加：

```html
<link rel="icon" href="favicon.ico" type="image/x-icon">
```

---

### 14. 添加统计代码
**位置**：`index.html` 的 `</body>` 标签之前

**示例**（百度统计）：
```html
<!-- 在第302行之前添加 -->
<script>
var _hmt = _hmt || [];
(function() {
  var hm = document.createElement("script");
  hm.src = "https://hm.baidu.com/hm.js?你的统计代码";
  var s = document.getElementsByTagName("script")[0]; 
  s.parentNode.insertBefore(hm, s);
})();
</script>
```

---

## ✅ 修改后的测试清单

完成修改后，请检查以下内容：

- [ ] 所有链接都能正常打开
- [ ] 页面在电脑上显示正常
- [ ] 页面在手机上显示正常
- [ ] 颜色搭配协调美观
- [ ] 文字描述准确清晰
- [ ] 没有错别字
- [ ] 图标显示正常
- [ ] 悬停效果正常

---

## 💡 常见问题

**Q1：修改后页面没有变化？**
- 清除浏览器缓存（Ctrl + F5 强制刷新）

**Q2：样式错乱了怎么办？**
- 检查CSS代码是否有语法错误
- 确保没有删除或修改必要的类名

**Q3：链接打不开？**
- 检查网址是否包含 `http://` 或 `https://`
- 确认目标网站是否可访问

**Q4：想恢复默认样式？**
- 保留原始文件的备份
- 或从项目仓库重新下载

---

如有其他问题，欢迎随时咨询！🎉

