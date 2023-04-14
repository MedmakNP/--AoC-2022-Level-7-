const fs = require('fs');
let input = fs.readFileSync('DirSystem.txt','utf-8');
const catalogs = input.split('\n').map(String);
function createTree(lines) {
  const tree = {
    name: "/",
    isDirectory: true,
    children: [],
  };

  let currentNode = tree;
  let currentCommand = null;

  for (const line of lines) {
    if (line[0] === "$") {
      let match;
      if (line.startsWith("$ ")) {
        const parts = line.slice(2).split(" ");
        const command = parts.shift();
        const arg = parts.join(" ");
        match = {
          input: line,
          groups: {
            command: command,
            arg: arg || undefined,
          },
        };
      }
      currentCommand = match.groups.command;

      if (currentCommand === "cd") {
        const target = match.groups.arg;
        switch (target) {
          case "/":
            currentNode = tree;
            break;
          case "..":
            currentNode = currentNode.parent;
            break;
          default:
            currentNode = currentNode.children.find((folder) => folder.isDirectory && folder.name === target);
        }
      }
    } else {
      if (currentCommand === "ls") {
        let fileMatch;
        const parts = line.split(" ");
        if (parts.length > 1 && !isNaN(parts[0])) {
          const size = parseInt(parts.shift());
          const name = parts.join(" ");
          fileMatch = { input: line, groups: {size: size, name: name, }};
        }
        if (fileMatch) {
          const node = {
            name: fileMatch.groups.name,
            size: parseInt(fileMatch.groups.size),
            isDirectory: false,
            parent: currentNode,
          };
          currentNode.children.push(node);
        }
        let dirMatch;
        if (line.startsWith("dir ")) {
          const name = line.slice(4);
          dirMatch = { input: line, groups: {  name: name, }};
        }
        if (dirMatch) {
          const node = {
            name: dirMatch.groups.name,
            isDirectory: true,
            children: [],
            parent: currentNode,
          };
          currentNode.children.push(node);
        }
      } 
    }
  }
  return tree;
}

function getSize(node, directoryCallback = () => {}) {
  if (!node.isDirectory) {
    return node.size;
  }
  const directorySize = node.children
    .map((child) => getSize(child, directoryCallback))
    .reduce((a, b) => a + b, 0);

  directoryCallback(node.name, directorySize);

  return directorySize;
}

function part1() {
  const tree = createTree(catalogs);
  let sumSmallFolder = 0;

  getSize(tree, (name, size) => {
    if (size < 100000) {
      sumSmallFolder += size;
    }
  });

  console.log(sumSmallFolder);
}
part1();
function deleteSize2(){
  const tree = createTree(catalogs); 
  let deleteSize = 0;
  let count = 0; 
  let arr = [];
  getSize(tree, (name, size) => {
     arr.push(size);
     deleteSize = size - 40000000
  });
  arr.sort((a, b) => a - b)
  arr.map((item)=>{
    if(count === 0){
      if(item > deleteSize){
        count = 1
        console.log(item)
      }
     else{} 
    }
  })
}
deleteSize2()