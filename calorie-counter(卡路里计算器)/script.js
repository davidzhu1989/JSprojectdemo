// 获取表格的ID
const calorieCounter = document.getElementById('calorie-counter');
const budgetNumberInput = document.getElementById('budget');
const entryDropdown = document.getElementById("entry-dropdown");

const addEntryButton = document.getElementById("add-entry");
const clearButton = document.getElementById("clear");
const output = document.getElementById("output");

let isError = false;

function cleanInputString(str){
    // const regex = /\+-/;
    //const regex = /[+-\s]/;
    //全局查找
    const regex = /[+-\s]/g;
    return str.replace(regex, '');
}

/* 第 28 步
 在 HTML 中，数字输入允许使用指数表示法（例如 1e10）。 你需要将它们过滤掉。
 首先创建一个名为 isInvalidInput 的函数 – 它应该接受一个 str 参数。
*/
function isInvalidInput(str){
    // const regex = /[0-9]e[0-9]/i;
    
    //多次就是往后面加+
    // const regex = /[0-9]+e[0-9]+/i;

    //匹配任何数字 \d
    const regex = /\d+e\d+/i;
    const regex2 = /[e]/;
    return str.match(regex);
}

/* 你的下一步是允许用户向卡路里计数器添加条目。 
声明一个空函数 addEntry。 此函数不应接受任何参数。
*/ 
function addEntry(){
    const targetInputContainer = document.querySelector(`#${entryDropdown.value} .input-container`);
    const entryNumber  = targetInputContainer.querySelectorAll('input[type="text"').length + 1;
    const HTMLString = `
    <label for = "${entryDropdown.value}-${entryNumber}-name">Entry ${entryNumber} Name</label>
    <input type = "text" id="${entryDropdown.value}-${entryNumber}-name" placeholder = "Name"/>
    <label for="${entryDropdown.value} - ${entryNumber}-calories">Entry ${entryNumber} Calories</label>
    <input type="number" min="0" id="${entryDropdown.value}-${entryNumber}-calories" placeholder="Calories"/>
    
    `
    targetInputContainer.insertAdjacentHTML('beforeend',HTMLString);
}


// 编写一个函数，从用户输入的内容中获取卡路里计数。
function getCaloriesFromInputs(list){
    let calories = 0;
    for (const item of list){
        const currVal = cleanInputString(item.value);
        const invalidInputMatch  = isInvalidInput(currVal);

        if (invalidInputMatch){
            alert(`Invalid Input: ${invalidInputMatch[0]}`);
            isError = true;
            return null;
        }
        calories += Number(currVal);
    }
    return calories;
}


// 此函数将是另一个事件监听器，因此传递的第一个参数将是浏览器事件 
function calculateCalories(e){
    // 你需要使用 e 参数的 preventDefault() 方法来阻止此默认操作。
    e.preventDefault();
    isError = false;

    const breakfastNumberInputs = document.querySelectorAll("#breakfast input[type='number']");
  const lunchNumberInputs = document.querySelectorAll("#lunch input[type='number']");
  const dinnerNumberInputs = document.querySelectorAll("#dinner input[type='number']");
  const snacksNumberInputs = document.querySelectorAll("#snacks input[type='number']");
  const exerciseNumberInputs = document.querySelectorAll("#exercise input[type='number']");

  const breakfastCalories = getCaloriesFromInputs(breakfastNumberInputs);
  const lunchCalories = getCaloriesFromInputs(lunchNumberInputs);
  const dinnerCalories = getCaloriesFromInputs(dinnerNumberInputs);
  const snacksCalories = getCaloriesFromInputs(snacksNumberInputs);
  const exerciseCalories = getCaloriesFromInputs(exerciseNumberInputs);
  //原来把变成NodeList就直接前面加个[]
  const budgetCalories =   getCaloriesFromInputs([budgetNumberInput]);

  if(isError){
    return;
  }

  const consumedCalories = breakfastCalories+lunchCalories+snacksCalories;
  const remainingCalories = budgetCalories - consumedCalories;
  const surplusOrDeficit = remainingCalories <0? 'Surpuls' : 'Deficit';
  output.innerHTML = `
  <span class="${surplusOrDeficit.toLowerCase()}">
  ${Math.abs(remainingCalories)} Calorie ${surplusOrDeficit}
  </span>
   <hr>
  <p>${budgetCalories} Calories Budgeted</p>
  <p>${consumedCalories} Calories Consumed</p>
  <p>${exerciseCalories} Calories Burned</p>


  
  `;

//  你需要使 #output 元素可见，以便用户可以看到你的文本。 
// 你的 output 变量是一个元素，它具有 classList 属性。 
// 此属性具有 .remove() 方法，该方法接受一个字符串，表示要从元素中删除的类。
  output.classList.remove("hide");
}


/* 添加用户清除表单的功能 */
function clearForm(){
    const inputContainers = document.querySelectorAll(".input-container");
    //中间又多了一个for of 和 for in 的区别，这个时候数组用for of
    for (const container of inputContainers) {
        container.innerHTML = '';
      }
    budgetNumberInput.value = '';
    output.innerText = '';
    output.classList.add("hide");
}



addEntryButton.addEventListener("click", addEntry);

//在Calculate Remaining Calories 按钮添加事件监听器
// Fuck U 你居然忘记listen这个单词怎么拼写了。

calorieCounter.addEventListener("submit",calculateCalories);

//clearButton添加事件监听器
clearButton.addEventListener("click",clearForm);