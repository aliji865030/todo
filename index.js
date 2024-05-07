const fs = require('fs');
const readline = require('readline');
const path = require('path');

const filePath = path.join(__dirname, 'tasks.json');

// Ensure the file exists
const initializeTasksFile = () => {
    if (!fs.existsSync(filePath)) {
        fs.writeFileSync(filePath, JSON.stringify([]));
    } else {
        try {
            JSON.parse(fs.readFileSync(filePath));
        } catch (error) {
            console.error("Error reading the tasks file. Ensure it contains valid JSON.");
            fs.writeFileSync(filePath, JSON.stringify([])); // Reset file if corrupted
        }
    }
};

const rl = readline.createInterface({
    input: process.stdin,
    output: process.stdout
});

const mainMenu = () => {
    console.log('\n1. Add a new task');
    console.log('2. View list of tasks');
    console.log('3. Mark a task as complete');
    console.log('4. Remove a task');
    console.log('5. Exit');
    rl.question('Enter your choice: ', (answer) => {
        switch (answer) {
            case '1':
                addTask();
                break;
            case '2':
                viewTasks();
                break;
            case '3':
                markTaskAsComplete();
                break;
            case '4':
                removeTask();
                break;
            case '5':
                rl.close();
                break;
            default:
                console.log('Invalid option. Please enter a number between 1 and 5.');
                mainMenu();
        }
    });
};

const addTask = () => {
    rl.question('Enter the new task description: ', (desc) => {
        const newTask = { id: Date.now(), description: desc, completed: false };
        const tasks = JSON.parse(fs.readFileSync(filePath));
        tasks.push(newTask);
        fs.writeFileSync(filePath, JSON.stringify(tasks));
        console.log('Task added successfully!');
        mainMenu();
    });
};

const viewTasks = () => {
    const tasks = JSON.parse(fs.readFileSync(filePath));
    if (tasks.length === 0) {
        console.log('No tasks to display.');
    } else {
        tasks.forEach(task => {
            console.log(`${task.id}: ${task.description} [${task.completed ? 'Completed' : 'Pending'}]`);
        });
    }
    mainMenu();
};

const markTaskAsComplete = () => {
    const tasks = JSON.parse(fs.readFileSync(filePath));
    if (tasks.length === 0) {
        console.log('No tasks available to mark as complete.');
        mainMenu();
        return;
    }
    
    tasks.forEach(task => {
        console.log(`${task.id}: ${task.description} [${task.completed ? 'Completed' : 'Pending'}]`);
    });

    rl.question('Enter the ID of the task to mark as complete: ', (id) => {
        const taskIndex = tasks.findIndex(task => task.id.toString() === id);
        if (taskIndex === -1) {
            console.log('Task not found. Please enter a valid ID.');
            mainMenu();
        } else {
            tasks[taskIndex].completed = true;
            fs.writeFileSync(filePath, JSON.stringify(tasks));
            console.log('Task marked as complete!');
            mainMenu();
        }
    });
};


const removeTask = () => {
    try {
        let tasks = JSON.parse(fs.readFileSync(filePath));
        if (tasks.length === 0) {
            console.log('No tasks available to remove.');
            mainMenu();
            return;
        }

        tasks.forEach(task => {
            console.log(`${task.id}: ${task.description} [${task.completed ? 'Completed' : 'Pending'}]`);
        });

        rl.question('Enter the ID of the task to remove: ', (id) => {
            const originalLength = tasks.length;
            tasks = tasks.filter(task => task.id.toString() !== id);

            if (tasks.length === originalLength) {
                console.log('Task not found. Please enter a valid ID.');
                mainMenu();
            } else {
                fs.writeFileSync(filePath, JSON.stringify(tasks));
                console.log('Task removed successfully!');
                mainMenu();
            }
        });
    } catch (error) {
        console.error("Failed to process task removal:", error);
        mainMenu();
    }
};

initializeTasksFile();
mainMenu();
