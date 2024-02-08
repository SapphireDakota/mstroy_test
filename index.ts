type Identifier = number | string

interface TreeElement {
    id: Identifier
    parent: Identifier
    type?: string | null
}

interface TreeNode {
    element: TreeElement | undefined
    children: TreeElement[]
    allChildren: TreeElement[]
    allParents: TreeElement[]
}

interface TreeElementsStore {
    [id: Identifier]: TreeNode
}

class TreeStore {
    treeElementsList: TreeElement[]
    elementsStore: TreeElementsStore

    constructor(treeElementsList: TreeElement[]) {
        this.treeElementsList = treeElementsList
        this.elementsStore = {}
        const store = this.elementsStore
        treeElementsList.forEach((element, _, array) => {
            store[element.id] = {
                element: element,
                children: [],
                allChildren: [],
                allParents: []
            }
            store[element.id].children = array.filter(childElement => childElement.parent === element.id)

            if (!store[element.parent]) {
                store[element.parent] = {
                    element: undefined,
                    children: [],
                    allChildren: [],
                    allParents: []
                }
            }
            if (!store[element.parent].children.includes(element)) {
                store[element.parent].children.push(element)
                store[element.parent].allChildren.push(element)
            }
        })

        treeElementsList.forEach(element => this.defineChildren(element))
        treeElementsList.forEach(element => this.defineChildren(element))
    }
    private defineChildren(element: TreeElement) {
        let tempElement: TreeNode | undefined = this.elementsStore[element.id]
            while(tempElement?.element?.parent !== undefined && this.elementsStore[tempElement.element.parent]?.element) {
                const parentElement: TreeNode = this.elementsStore[tempElement.element.parent]

                if (!tempElement.allParents.find(parent => parent.id === parentElement.element!.id)) {
                    tempElement.allParents.push(parentElement.element!)
                    tempElement.allParents = parentElement.allParents.concat(tempElement.allParents).reverse()
                }
                
                if (!parentElement.children.find(child => child.id === tempElement?.element?.id)) {
                    parentElement.children.push(tempElement.element)
                }
                
                let childrenSet = new Set(parentElement.allChildren.concat(parentElement.children).concat(tempElement.allChildren))
                parentElement.allChildren = Array.from(childrenSet).reverse()
                tempElement = parentElement
            }
    }
    getAll(): TreeElement[] {
        return this.treeElementsList
    }
    getItem(id: Identifier): TreeElement | undefined {
        return this.elementsStore[id].element
    }
    getChildren(id: Identifier) {
        return this.elementsStore[id].children
    }
    getAllChildren(id: Identifier) {
        return this.elementsStore[id].allChildren
    }
    getAllParents(id: Identifier) {
        return this.elementsStore[id].allParents
    }
}

const items: TreeElement[] = [
    { id: 1, parent: 'root' },
    { id: 2, parent: 1, type: 'test' },
    { id: 3, parent: 1, type: 'test' },

    { id: 4, parent: 2, type: 'test' },
    { id: 5, parent: 2, type: 'test' },
    { id: 6, parent: 2, type: 'test' },

    { id: 7, parent: 4, type: null },
    { id: 8, parent: 4, type: null },
];
const ts = new TreeStore(items);

console.log(`ts.getAll() - ${JSON.stringify(ts.getAll())}\n`)
console.log(`ts.getItem(7) - ${JSON.stringify(ts.getItem(7))}\n`)
console.log(`ts.getChildren(4) - ${JSON.stringify(ts.getChildren(4))}\n`)
console.log(`ts.getChildren(5) - ${JSON.stringify(ts.getChildren(5))}\n`)
console.log(`ts.getChildren(2) - ${JSON.stringify(ts.getChildren(2))}\n`)
console.log(`ts.getAllChildren(2) - ${JSON.stringify(ts.getAllChildren(2))}\n`)
console.log(`ts.getAllParents(7) - ${JSON.stringify(ts.getAllParents(7))}\n`)