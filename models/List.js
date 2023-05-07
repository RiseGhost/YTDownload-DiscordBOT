//Split the string into elements using "SplitList" to identify separator elements
//and place the separate elements in the "list"
//Examples:  str = "1.08,5;10 6,22-25 78-56.36"  list = [1.08,5,6,10,22,25,78,56.36]
function List(str, SplitList, list){
    if (SplitList[0] == null){
        if (str != '') list.push(str)
        return null
    }
    str.split(SplitList[0]).forEach(element => {  List(element, SplitList.slice(1), list)  })
}

//Check if the list has only numbers
function isNumericList(list){
    return (list[0] == null) ? true : ((!isNaN(list[0])) ? true && isNumericList(list.slice(1)) : false)
}

//Format the input
function format(str){
    return str.replace(/([,;-])\s+/g, '$1').replace(/\[|\]/g, '').replace(/  /g, ' ')
}

function sumElements(list){  return (list[0] == null) ? 0 : parseFloat(list[0]) + sumElements(list.slice(1))  }
function average(list){  return (isNumericList(list)) ? (sumElements(list) / list.length).toString() : "Nahn"  }

module.exports = {List, isNumericList, format, average, sumElements}