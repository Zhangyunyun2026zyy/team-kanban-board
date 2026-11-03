let tasks = JSON.parse(localStorage.getItem("kanban_tasks")) || []; function render() { document.getElementById("list-todo").innerHTML = ""; document.getElementById("list-doing").innerHTML = ""; document.getElementById("list-done").innerHTML = ""; tasks.forEach(task => { const card = document.createElement("div"); card.className = "task-card"; card.draggable = true; card.dataset.id = task.id; card.innerHTML = `<span>${task.content}</span>`; document.getElementById(`list-${task.status}`).appendChild(card); }); localStorage.setItem("kanban_tasks", JSON.stringify(tasks)); } render();
// ==================== 张云云：拖拽功能开始 ====================

// 1. 开始拖拽卡片
document.addEventListener('dragstart', (e) => {
    const card = e.target.closest('.task-card');
    if (!card) return;

    e.dataTransfer.setData('text/plain', card.dataset.id);
    e.dataTransfer.effectAllowed = 'move';

    card.classList.add('dragging');
});

// 2. 拖拽结束，清理样式
document.addEventListener('dragend', (e) => {
    const card = e.target.closest('.task-card');
    if (card) {
        card.classList.remove('dragging');
    }

    document.querySelectorAll('.task-list').forEach(list => {
        list.classList.remove('drag-over');
    });
});

// 3. 给三个任务列表添加拖拽接收事件
document.querySelectorAll('.task-list').forEach(list => {
    list.addEventListener('dragover', (e) => {
        e.preventDefault();
        e.dataTransfer.dropEffect = 'move';
        list.classList.add('drag-over');
    });

    list.addEventListener('dragleave', (e) => {
        if (!list.contains(e.relatedTarget)) {
            list.classList.remove('drag-over');
        }
    });

    list.addEventListener('drop', (e) => {
        e.preventDefault();
        list.classList.remove('drag-over');

        const taskId = e.dataTransfer.getData('text/plain');
        const column = list.closest('.column');
        const newStatus = column ? column.dataset.status : null;

        if (!taskId || !newStatus) return;

        const task = tasks.find(t => String(t.id) === String(taskId));
        if (!task) return;

        if (task.status === newStatus) return;

        task.status = newStatus;
        render();
    });
});

// ==================== 张云云：拖拽功能结束 ====================