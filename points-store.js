// 全局变量
let studentsData = [];
let productsData = [];
let currentCategory = 'all';
let isAdminMode = false;
let currentProductId = null;
let fullData = null; // 存储完整的JSON数据

// 页面加载时初始化
document.addEventListener('DOMContentLoaded', async () => {
    await loadData();
    renderProducts();
    setupEventListeners();
    setupAdminListeners();
});

// 加载数据
async function loadData() {
    try {
        const response = await fetch('少儿编程机构数据备份_2025-10-30_22-27-35.json');
        const data = await response.json();
        fullData = data; // 保存完整数据
        studentsData = data.students || [];
        productsData = data.pointsStoreProducts || [];
        console.log('数据加载成功:', { students: studentsData.length, products: productsData.length });
    } catch (error) {
        console.error('数据加载失败:', error);
        showError('数据加载失败，请刷新页面重试');
    }
}

// 设置事件监听器
function setupEventListeners() {
    // 分类筛选按钮
    const filterBtns = document.querySelectorAll('.filter-btn');
    filterBtns.forEach(btn => {
        btn.addEventListener('click', () => {
            filterBtns.forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            currentCategory = btn.dataset.category;
            renderProducts();
        });
    });

    // 输入框回车查询
    document.getElementById('studentId').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') queryPoints();
    });
    document.getElementById('studentName').addEventListener('keypress', (e) => {
        if (e.key === 'Enter') queryPoints();
    });
}

// 查询积分
function queryPoints() {
    const studentId = document.getElementById('studentId').value.trim();
    const studentName = document.getElementById('studentName').value.trim();
    const resultDiv = document.getElementById('queryResult');

    // 验证输入
    if (!studentId || !studentName) {
        showQueryResult('error', '请输入学号和姓名');
        return;
    }

    // 检查是否为管理员
    if (studentId === '1024000' && studentName === '小布老师') {
        enableAdminMode();
        return;
    }

    // 查找学生
    const student = studentsData.find(s => 
        s.id.toString() === studentId && s.name === studentName
    );

    if (student) {
        // 显示学生信息
        const resultHTML = `
            <div class="student-info">
                <div class="info-item">
                    <i class="fas fa-id-card"></i>
                    <span><strong>学号：</strong>${student.id}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-user"></i>
                    <span><strong>姓名：</strong>${student.name}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-book"></i>
                    <span><strong>课程：</strong>${student.course}</span>
                </div>
                <div class="info-item">
                    <i class="fas fa-school"></i>
                    <span><strong>学校：</strong>${student.school}</span>
                </div>
            </div>
            <div class="points-display">
                <i class="fas fa-coins"></i>
                当前积分：${student.points}
            </div>
        `;
        showQueryResult('success', resultHTML);
    } else {
        showQueryResult('error', '未找到该学生信息，请检查学号和姓名是否正确');
    }
}

// 显示查询结果
function showQueryResult(type, content) {
    const resultDiv = document.getElementById('queryResult');
    resultDiv.className = `query-result ${type}`;
    resultDiv.innerHTML = content;
}

// 渲染商品列表
function renderProducts() {
    const grid = document.getElementById('productsGrid');
    
    // 筛选商品
    let filteredProducts = productsData;
    if (currentCategory !== 'all') {
        filteredProducts = productsData.filter(p => p.category === currentCategory);
    }

    // 按积分排序
    filteredProducts.sort((a, b) => a.points - b.points);

    // 生成商品卡片
    if (filteredProducts.length === 0) {
        grid.innerHTML = '<p style="grid-column: 1/-1; text-align: center; color: var(--text-gray);">暂无商品</p>';
        return;
    }

    grid.innerHTML = filteredProducts.map(product => `
        <div class="product-card" onclick="showProductDetail('${product.id}')">
            <img src="${product.image}" alt="${product.name}" class="product-image" 
                 onerror="this.src='https://via.placeholder.com/200?text=暂无图片'">
            <h3 class="product-name">${product.name}</h3>
            <div class="product-points">
                <i class="fas fa-coins"></i>
                ${product.points}
            </div>
            <div class="product-stock ${product.stock === 0 ? 'out-of-stock' : ''}">
                ${product.stock === 0 ? '已售罄' : `库存：${product.stock}`}
            </div>
        </div>
    `).join('');
}

// 显示商品详情
function showProductDetail(productId) {
    const product = productsData.find(p => p.id === productId);
    if (!product) return;

    currentProductId = productId; // 保存当前商品ID

    // 填充模态框内容
    document.getElementById('modalImage').src = product.image;
    document.getElementById('modalImage').alt = product.name;
    document.getElementById('modalName').textContent = product.name;
    document.getElementById('modalCategory').textContent = product.category;
    document.getElementById('modalPoints').textContent = product.points;
    document.getElementById('modalStock').textContent = product.stock === 0 ? '已售罄' : product.stock;
    
    const description = product.description || '暂无描述';
    document.getElementById('modalDescription').innerHTML = `
        <strong>商品描述：</strong><br>${description}
    `;

    // 如果是管理员模式，显示编辑区域并填充所有字段
    const adminEditSection = document.getElementById('adminEditSection');
    if (isAdminMode) {
        adminEditSection.style.display = 'block';
        
        // 填充编辑表单
        document.getElementById('editName').value = product.name || '';
        document.getElementById('editCategory').value = product.category || '饮品';
        document.getElementById('editPoints').value = product.points || 0;
        document.getElementById('editStock').value = product.stock || 0;
        document.getElementById('editImage').value = product.image || '';
        document.getElementById('editDescription').value = product.description || '';
        
        // 确保按钮功能正确
        const saveBtn = document.querySelector('.save-btn');
        const deleteBtn = document.querySelector('.delete-btn');
        if (saveBtn) saveBtn.onclick = saveProductChanges;
        if (deleteBtn) {
            deleteBtn.style.display = 'flex';
            deleteBtn.onclick = deleteProduct;
        }
    } else {
        adminEditSection.style.display = 'none';
    }

    // 显示模态框
    document.getElementById('productModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// 关闭模态框
function closeModal() {
    document.getElementById('productModal').classList.remove('active');
    document.body.style.overflow = '';
    
    // 恢复保存和删除按钮的功能
    const saveBtn = document.querySelector('.save-btn');
    const deleteBtn = document.querySelector('.delete-btn');
    if (saveBtn) saveBtn.onclick = saveProductChanges;
    if (deleteBtn) {
        deleteBtn.style.display = 'flex';
        deleteBtn.onclick = deleteProduct;
    }
}

// 显示错误信息
function showError(message) {
    alert(message);
}

// 更新数据统计
function updateDataStats() {
    const totalPoints = studentsData.reduce((sum, s) => sum + (s.points || 0), 0);
    const totalStock = productsData.reduce((sum, p) => sum + (p.stock || 0), 0);
    
    document.getElementById('statStudents').textContent = `${studentsData.length} 人`;
    document.getElementById('statProducts').textContent = `${productsData.length} 个`;
    document.getElementById('statPoints').textContent = `${totalPoints.toLocaleString()} 分`;
    document.getElementById('statStock').textContent = `${totalStock.toLocaleString()} 件`;
}

// 启用管理员模式
function enableAdminMode() {
    isAdminMode = true;
    
    // 显示成功信息
    const resultHTML = `
        <div class="student-info">
            <div class="info-item">
                <i class="fas fa-user-shield"></i>
                <span><strong>欢迎，管理员！</strong></span>
            </div>
        </div>
        <div class="points-display" style="color: #e74c3c;">
            <i class="fas fa-crown"></i>
            管理员模式已启用
        </div>
    `;
    showQueryResult('success', resultHTML);
    
    // 显示管理员面板和指示器
    document.getElementById('adminPanel').style.display = 'block';
    document.getElementById('adminModeIndicator').style.display = 'flex';
    
    // 更新数据统计
    updateDataStats();
    
    console.log('管理员模式已启用');
}

// 设置管理员相关监听器
function setupAdminListeners() {
    // 文件上传监听
    const fileInput = document.getElementById('jsonFileInput');
    fileInput.addEventListener('change', handleFileUpload);
}

// 处理文件上传
function handleFileUpload(event) {
    const file = event.target.files[0];
    if (!file) return;

    document.getElementById('fileName').textContent = file.name;

    const reader = new FileReader();
    reader.onload = function(e) {
        try {
            const data = JSON.parse(e.target.result);
            
            // 验证数据格式
            if (!data.students || !data.pointsStoreProducts) {
                alert('JSON文件格式不正确，请确保包含 students 和 pointsStoreProducts 字段');
                return;
            }

            // 更新数据
            fullData = data;
            studentsData = data.students || [];
            productsData = data.pointsStoreProducts || [];
            
            // 重新渲染商品列表
            renderProducts();
            
            // 更新数据统计
            if (isAdminMode) {
                updateDataStats();
            }
            
            alert(`数据更新成功！\n学生数：${studentsData.length}\n商品数：${productsData.length}`);
            console.log('数据已更新', { students: studentsData.length, products: productsData.length });
        } catch (error) {
            alert('JSON文件解析失败：' + error.message);
            console.error('JSON解析错误:', error);
        }
    };
    
    reader.readAsText(file);
}

// 导出数据
function exportData() {
    if (!fullData) {
        alert('没有可导出的数据');
        return;
    }

    // 更新导出数据，确保包含所有最新数据
    fullData.students = studentsData;
    fullData.pointsStoreProducts = productsData;
    fullData.exportDate = new Date().toISOString();
    
    // 添加导出统计信息
    const stats = {
        totalStudents: studentsData.length,
        totalProducts: productsData.length,
        totalPoints: studentsData.reduce((sum, s) => sum + (s.points || 0), 0),
        totalStock: productsData.reduce((sum, p) => sum + (p.stock || 0), 0),
        exportTime: new Date().toLocaleString('zh-CN')
    };

    const dataStr = JSON.stringify(fullData, null, 2);
    const blob = new Blob([dataStr], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    
    const a = document.createElement('a');
    a.href = url;
    const timestamp = new Date().toISOString().slice(0, 19).replace(/:/g, '-');
    a.download = `少儿编程机构数据备份_${timestamp}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
    
    // 显示详细的导出信息
    let message = '✅ 数据导出成功！\n\n';
    message += '━━━━━━━━━━━━━━━━━━\n';
    message += `📦 文件名：少儿编程机构数据备份_${timestamp}.json\n\n`;
    message += '📊 导出统计：\n';
    message += `👥 学生数据：${stats.totalStudents} 人\n`;
    message += `💰 总积分：${stats.totalPoints} 分\n`;
    message += `🎁 商品数据：${stats.totalProducts} 个\n`;
    message += `📦 总库存：${stats.totalStock} 件\n`;
    if (fullData.courses) message += `📚 课程数据：${fullData.courses.length} 门\n`;
    if (fullData.transactions) message += `💵 财务记录：${fullData.transactions.length} 条\n`;
    message += '━━━━━━━━━━━━━━━━━━\n';
    message += `🕐 导出时间：${stats.exportTime}`;
    
    alert(message);
    
    console.log('✅ 数据已导出', stats);
}

// 调整库存
function adjustStock(delta) {
    const stockInput = document.getElementById('editStock');
    let currentValue = parseInt(stockInput.value) || 0;
    let newValue = Math.max(0, currentValue + delta);
    stockInput.value = newValue;
}

// 保存商品修改
function saveProductChanges() {
    if (!currentProductId) return;

    // 获取表单数据
    const newName = document.getElementById('editName').value.trim();
    const newCategory = document.getElementById('editCategory').value;
    const newPoints = parseInt(document.getElementById('editPoints').value);
    const newStock = parseInt(document.getElementById('editStock').value);
    const newImage = document.getElementById('editImage').value.trim();
    const newDescription = document.getElementById('editDescription').value.trim();

    // 验证必填字段
    if (!newName) {
        alert('商品名称不能为空');
        return;
    }
    if (isNaN(newPoints) || newPoints < 0) {
        alert('请输入有效的积分数量');
        return;
    }
    if (isNaN(newStock) || newStock < 0) {
        alert('请输入有效的库存数量');
        return;
    }
    if (!newImage) {
        alert('商品图片URL不能为空');
        return;
    }

    // 查找并更新商品数据
    const product = productsData.find(p => p.id === currentProductId);
    if (product) {
        product.name = newName;
        product.category = newCategory;
        product.points = newPoints;
        product.stock = newStock;
        product.image = newImage;
        product.description = newDescription;
        
        // 更新模态框显示
        document.getElementById('modalName').textContent = newName;
        document.getElementById('modalCategory').textContent = newCategory;
        document.getElementById('modalPoints').textContent = newPoints;
        document.getElementById('modalStock').textContent = newStock === 0 ? '已售罄' : newStock;
        document.getElementById('modalImage').src = newImage;
        document.getElementById('modalDescription').innerHTML = `
            <strong>商品描述：</strong><br>${newDescription || '暂无描述'}
        `;
        
        // 重新渲染商品列表
        renderProducts();
        
        // 更新数据统计
        if (isAdminMode) {
            updateDataStats();
        }
        
        alert('商品信息更新成功！');
        console.log(`商品 ${newName} 已更新`, product);
    }
}

// 删除商品
function deleteProduct() {
    if (!currentProductId) return;

    const product = productsData.find(p => p.id === currentProductId);
    if (!product) return;

    // 确认删除
    if (!confirm(`确定要删除商品"${product.name}"吗？此操作不可恢复！`)) {
        return;
    }

    // 从数组中删除商品
    const index = productsData.findIndex(p => p.id === currentProductId);
    if (index > -1) {
        productsData.splice(index, 1);
        
        // 关闭模态框
        closeModal();
        
        // 重新渲染商品列表
        renderProducts();
        
        // 更新数据统计
        if (isAdminMode) {
            updateDataStats();
        }
        
        alert('商品删除成功！');
        console.log(`商品 ${product.name} 已删除`);
    }
}

// 显示添加商品模态框
function showAddProductModal() {
    // 生成新的商品ID
    const timestamp = Date.now();
    const randomStr = Math.random().toString(36).substring(2, 11);
    const newProductId = `PROD${timestamp}${randomStr}`;
    
    currentProductId = newProductId;

    // 清空并填充默认值
    document.getElementById('modalImage').src = 'https://via.placeholder.com/300?text=新商品';
    document.getElementById('modalImage').alt = '新商品';
    document.getElementById('modalName').textContent = '新商品';
    document.getElementById('modalCategory').textContent = '饮品';
    document.getElementById('modalPoints').textContent = '0';
    document.getElementById('modalStock').textContent = '0';
    document.getElementById('modalDescription').innerHTML = '<strong>商品描述：</strong><br>暂无描述';

    // 显示编辑区域并清空表单
    const adminEditSection = document.getElementById('adminEditSection');
    adminEditSection.style.display = 'block';
    
    document.getElementById('editName').value = '';
    document.getElementById('editCategory').value = '饮品';
    document.getElementById('editPoints').value = '0';
    document.getElementById('editStock').value = '0';
    document.getElementById('editImage').value = '';
    document.getElementById('editDescription').value = '';

    // 修改保存按钮功能为添加
    const saveBtn = document.querySelector('.save-btn');
    const deleteBtn = document.querySelector('.delete-btn');
    
    saveBtn.onclick = function() { saveNewProduct(newProductId); };
    deleteBtn.style.display = 'none'; // 隐藏删除按钮

    // 显示模态框
    document.getElementById('productModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// 保存新商品
function saveNewProduct(productId) {
    // 获取表单数据
    const name = document.getElementById('editName').value.trim();
    const category = document.getElementById('editCategory').value;
    const points = parseInt(document.getElementById('editPoints').value);
    const stock = parseInt(document.getElementById('editStock').value);
    const image = document.getElementById('editImage').value.trim();
    const description = document.getElementById('editDescription').value.trim();

    // 验证必填字段
    if (!name) {
        alert('商品名称不能为空');
        return;
    }
    if (isNaN(points) || points < 0) {
        alert('请输入有效的积分数量');
        return;
    }
    if (isNaN(stock) || stock < 0) {
        alert('请输入有效的库存数量');
        return;
    }
    if (!image) {
        alert('商品图片URL不能为空');
        return;
    }

    // 创建新商品对象
    const newProduct = {
        id: productId,
        name: name,
        category: category,
        points: points,
        image: image,
        description: description,
        stock: stock
    };

    // 添加到商品数组
    productsData.push(newProduct);

    // 关闭模态框
    closeModal();

    // 重新渲染商品列表
    renderProducts();
    
    // 更新数据统计
    if (isAdminMode) {
        updateDataStats();
    }

    // 恢复保存和删除按钮功能
    const saveBtn = document.querySelector('.save-btn');
    const deleteBtn = document.querySelector('.delete-btn');
    if (saveBtn) saveBtn.onclick = saveProductChanges;
    if (deleteBtn) {
        deleteBtn.style.display = 'flex';
        deleteBtn.onclick = deleteProduct;
    }

    alert('新商品添加成功！');
    console.log('新商品已添加', newProduct);
}

// 显示同步模态框
function showSyncModal() {
    document.getElementById('syncModal').classList.add('active');
    document.body.style.overflow = 'hidden';
}

// 关闭同步模态框
function closeSyncModal() {
    document.getElementById('syncModal').classList.remove('active');
    document.body.style.overflow = '';
}

// 复制导出代码
function copyExportCode() {
    const code = document.getElementById('exportCode').textContent;
    
    navigator.clipboard.writeText(code).then(() => {
        alert('代码已复制到剪贴板！现在请打开管理系统，按F12打开控制台，粘贴并执行代码。');
    }).catch(err => {
        console.error('复制失败:', err);
        // 降级方案：手动选择文本
        const range = document.createRange();
        range.selectNodeContents(document.getElementById('exportCode'));
        const selection = window.getSelection();
        selection.removeAllRanges();
        selection.addRange(range);
        alert('请手动复制选中的代码');
    });
}

// 导入同步数据
function importSyncData() {
    const jsonInput = document.getElementById('syncDataInput').value.trim();
    
    if (!jsonInput) {
        alert('请先粘贴从管理系统获取的数据');
        return;
    }
    
    try {
        const data = JSON.parse(jsonInput);
        
        // 验证数据格式
        if (!data.students && !data.pointsStoreProducts) {
            alert('数据格式不正确，请确保包含学生或商品数据');
            return;
        }
        
        // 完整替换学生数据
        if (data.students && Array.isArray(data.students)) {
            studentsData = [...data.students]; // 深拷贝
            console.log(`✅ 已同步 ${studentsData.length} 个学生数据`);
            
            // 显示学生详细信息
            studentsData.forEach(student => {
                console.log(`  - 学号: ${student.id}, 姓名: ${student.name}, 积分: ${student.points}`);
            });
        }
        
        // 完整替换商品数据
        if (data.pointsStoreProducts && Array.isArray(data.pointsStoreProducts)) {
            productsData = [...data.pointsStoreProducts]; // 深拷贝
            console.log(`✅ 已同步 ${productsData.length} 个商品数据`);
            
            // 显示商品分类统计
            const categories = {};
            productsData.forEach(product => {
                categories[product.category] = (categories[product.category] || 0) + 1;
            });
            console.log('  商品分类统计:', categories);
        }
        
        // 完整更新数据对象
        fullData = {
            students: data.students || studentsData,
            pointsStoreProducts: data.pointsStoreProducts || productsData,
            courses: data.courses || [],
            transactions: data.transactions || [],
            attendance: data.attendance || {},
            leaveRecords: data.leaveRecords || {},
            schedule: data.schedule || {},
            exportDate: data.exportDate || new Date().toISOString(),
            version: data.version || '2.1',
            syncDate: new Date().toISOString() // 添加同步时间
        };
        
        // 重新渲染商品列表
        renderProducts();
        
        // 更新数据统计
        if (isAdminMode) {
            updateDataStats();
        }
        
        // 清空输入框
        document.getElementById('syncDataInput').value = '';
        
        // 关闭模态框
        closeSyncModal();
        
        // 显示详细的成功消息
        let message = '🎉 数据同步成功！\n\n';
        message += '━━━━━━━━━━━━━━━━━━\n';
        
        if (data.students && data.students.length > 0) {
            message += `👥 学生信息：${data.students.length} 人\n`;
            const totalPoints = data.students.reduce((sum, s) => sum + (s.points || 0), 0);
            message += `   总积分：${totalPoints} 分\n`;
        }
        
        if (data.pointsStoreProducts && data.pointsStoreProducts.length > 0) {
            message += `🎁 商品信息：${data.pointsStoreProducts.length} 个\n`;
            const totalStock = data.pointsStoreProducts.reduce((sum, p) => sum + (p.stock || 0), 0);
            message += `   总库存：${totalStock} 件\n`;
        }
        
        if (data.courses && data.courses.length > 0) {
            message += `📚 课程信息：${data.courses.length} 门\n`;
        }
        
        if (data.transactions && data.transactions.length > 0) {
            message += `💰 财务记录：${data.transactions.length} 条\n`;
        }
        
        message += '━━━━━━━━━━━━━━━━━━\n';
        message += `🕐 同步时间：${new Date().toLocaleString('zh-CN')}\n\n`;
        message += '💡 建议：现在点击"导出数据"保存同步后的完整数据';
        
        alert(message);
        
        // 控制台输出详细日志
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('🔄 数据同步完成');
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        console.log('📊 同步统计:');
        console.log(`  学生数: ${studentsData.length}`);
        console.log(`  商品数: ${productsData.length}`);
        console.log('');
        console.log('📦 完整数据对象:', fullData);
        console.log('━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━');
        
    } catch (error) {
        console.error('❌ JSON解析错误:', error);
        alert('❌ 数据格式错误！\n\n请确保粘贴的是有效的JSON数据。\n\n错误信息：' + error.message);
    }
}

// ESC键关闭模态框
document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') {
        closeModal();
        closeSyncModal();
    }
});

