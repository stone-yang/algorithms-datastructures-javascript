/**
 * 二叉树 Binary Search Tree
 * Notes: 二叉查找树将二叉树的2个节点分为左节点和右节点, 左节点的值小于父节点, 右节点的值大于父节点. 
 * 因此, 二叉查找树的插入查找节点操作效率很高. 缺点是删除节点比较麻烦
 */

/**
 * TreeNode
 * @property element 储存的元素
 * @property {TreeNode} left 左节点指针
 * @property {TreeNode} right 右节点指针
 */
class TreeNode {
  constructor(element, left, right) {
    this.element = element;
    this.left = left || null;
    this.right = right || null;
  }
}

/**
 * BinarySearchTree 二叉查找树: 递归实现
 * @property {TreeNode} root 根节点指针
 */
class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  /**
   * 插入节点
   * @param data 待插入的元素
   * @param {TreeNode} node 二叉查找树中的节点(默认为根节点)
   * @return {Boolean} 是否成功
   */
  insert(data, node = this.root) {
    if (!this.root) {
      const newNode = new TreeNode(data);
      this.root = newNode;
      return true;
    }
    let pos = '';	
    if (node.element === data) {
      return false;
    }	
    if (node.element > data) {
      pos = 'left';
    }
    if (node.element < data) {
      pos = 'right';
    }
    if (node[pos] === null) {
      const newNode = new TreeNode(data);
      node[pos] = newNode;
      return true;
    }
    return this.insert(data, node[pos]);
  }
  /**
   * 查找节点
   * @param data 要查找的元素
   * @param {TreeNode} node 二叉查找树中的节点(默认根节点)
   * @return {TreeNode} 找到的节点
   */
  find(data, node = this.root) {
    if (node === null) {
      return null;
    }
    if (node.element === data) {
      return node;
    }
    if (node.element > data) {
      return this.find(data, node.left);
    }
    if (node.element < data) {
      return this.find(data, node.right);
    }
  }
  /**
   * 中序遍历二叉查找树
   * @param {TreeNode} node 遍历开始的节点(默认为根节点)
   */
  displayInOrder(node = this.root) {
    if (node === null) {
      return;
    }
    this.displayInOrder(node.left);
    console.log(node.element + ' ');
    this.displayInOrder(node.right);
  }
  /**
   * 查找最小值
   * @param {TreeNode} node 查找开始的节点(默认根节点)
   * @return {TreeNode} 找到的节点
   */
  getMin(node = this.root) {
    if (node.left === null) {
      return node;
    }
    return this.getMin(node.left);
  }
  /**
   * 查找最大值
   * @param {TreeNode} node 查找开始的节点(默认根节点)
   * @return {TreeNode} 找到的节点
   */
  getMax(node = this.root) {
    if (node.right === null) {
      return node;
    }
    return this.getMin(node.right);
  }
  /**
   * 删除节点
   * @param data 查找条件
   * @return {Boolean} 操作是否成功
   */
  removeNode(data) {
    let done = false;
    const _remove = (data, node) => {
      let changedNode = node;
      if (node.element > data) {
        node.left =  _remove(data, node.left);
      }
      if (node.element < data) {
        node.right = _remove(data, node.right);
      }
      if (node.element === data) {
        if (node.left === null && node.right === null) {
          changedNode = null;
        }
        if (node.left && node.right === null) {
          changedNode = node.left;
        }
        if (node.right && node.left === null) {
          changedNode = node.right;
        }
        if (node.right && node.left) {
          const rightMinNode = this.getMin(node.right);
          node.element = rightMinNode.element;
          node.right = _remove(rightMinNode.element, node.right);
        }
        done = true;
      }
      return changedNode;
    }
    this.root = _remove(data, this.root);
    return done;
  }
}

/**
 * BinarySearchTree 二叉查找树: 迭代实现
 * @property {TreeNode} root 根节点指针
 */
class BinarySearchTree {
  constructor() {
    this.root = null;
  }
  /**
   * 插入节点
   * @param data 待插入的元素
   * @return {Boolean} 是否成功
   */
  insert(data) {
    const newNode = new TreeNode(data);
    if (!this.root) {
      this.root = newNode;
      return true;
    }
    let currNode = this.root;
    let prev = this.root;
    let isLeft = false;
    while (currNode !== null) {
      prev = currNode;
      if (currNode.element === data) {
        return false;
      }
      if (currNode.element > data) {
        currNode = currNode.left;
        isLeft = true;
      } else if (currNode.element < data) {
        currNode = currNode.right;
        isLeft = false;
      }
    }
    prev[isLeft ? 'left' : 'right'] = newNode;
    return true;		
  }
  /**
   * 中序遍历二叉查找树
   * @param {TreeNode} node 遍历开始的节点(默认为根节点)
   */
  displayInOrder(n = this.root) {
    const stack = [];
    let currNode = n;
    while (currNode !== null || stack.length > 0) {
      while (currNode !== null) {
        stack.push(currNode);
        currNode = currNode.left;
      }
      currNode = stack.pop();
      console.log(currNode.element);
      currNode = currNode.right;
    }
  }
  /**
   * 查找节点
   * @param data 要查找的元素
   * @param {TreeNode} node 二叉查找树中的节点(默认根节点)
   * @return {TreeNode} 找到的节点
   */
  find(data) {
    let currNode = this.root;
    while (currNode !== null) {
      if (currNode.element === data) {
        return currNode;
      }
      if (currNode.element < data) {
        currNode = currNode.right;
      } else if (currNode.element > data) {
        currNode = currNode.left;
      }
    }
    return null;
  }
  /**
   * 查找父节点
   * @param data 要查找的元素
   * @param {TreeNode} node 二叉查找树中的节点(默认根节点)
   * @return {TreeNode} 找到的节点
   */
  findParent(data, node = this.root) {
    let currNode = this.root;
    let parent = null;
    let pos = '';
    while (currNode !== null) {
      if (currNode.element === data) {
        return { node: parent, position: pos };
      }
      parent = currNode;
      if (currNode.element < data) {
        currNode = currNode.right;
        pos = 'right';
      } else if (currNode.element > data) {
        currNode = currNode.left;
        pos = 'left';
      }
    }
    return false;
  }
  /**
   * 查找最小值
   * @param {TreeNode} node 查找开始的节点(默认根节点)
   * @return {TreeNode} 找到的节点
   */
  getMin(n = this.root) {
    let currNode = n;
    while (true) {
      if (currNode.left === null) {
        break;
      }
      currNode = currNode.left;
    }
    return currNode;
  }
  /**
   * 查找最大值
   * @param {TreeNode} node 查找开始的节点(默认根节点)
   * @return {TreeNode} 找到的节点
   */
  getMax(n = this.root) {
    let currNode = n;
    while (true) {
      if (currNode.right === null) {
        break;
      }
      currNode = currNode.right;
    }
    return currNode;
  }
  /**
   * 删除节点
   * @param data 查找条件
   * @return {Boolean} 操作是否成功
   */
  removeNode(data) {
    const parentInfo = this.findParent(data);
    if (!parentInfo) {
      return false;
    }
    const parent = parentInfo.node;
    let pos = parentInfo.position;
    let currNode = parent[pos];
    if (!currNode.left && !currNode.right) {
      parent[pos] = null;
    }
    if (currNode.left && !currNode.right) {
      parent[pos] = currNode.left;
    }
    if (currNode.right && !currNode.left) {
      parent[pos] = currNode.right;
    }
    if (currNode.right && currNode.left) {
      const tempNode = this.getMin(currNode.right);
      let tempParent = this.findParent(tempNode.element, currNode.right);
      pos = tempParent.position;
      tempParent = tempParent.node;
      currNode.element = tempNode.element;
      tempParent.pos = null;
    }
    return true;
  }
}

const bst = new BinarySearchTree();
bst.insert(14);  // true
bst.insert(5);  // true
bst.insert(20);  // true
bst.insert(8);  // true
bst.find(5);  
// TreeNode {
//  element: 5,
//  left: null,
//  right: TreeNode { element: 8, left: null, right: null } }