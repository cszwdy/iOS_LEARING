//
//  Model.swift
//  ModelObserver
//
//  Created by Emiaostein on 6/9/15.
//  Copyright (c) 2015 BoTai Technology. All rights reserved.
//

import UIKit

func ==<T>(lhs: Listener<T>, rhs: Listener<T>) -> Bool {
    return lhs.name == rhs.name
}


struct Listener<T>: Hashable {
    
    let name: String
    
    typealias Action = T -> Void
    let action: Action

    
    var hashValue: Int {
        return name.hashValue
    }
}

class Dynamic<T> {

   private var listenerSet = Set<Listener<T>>()
 
    func bind(ID: String, action: Listener<T>.Action) -> Bool {
        let listener = Listener(name: ID, action: action)
        if listenerSet.contains(listener) {
//            assert(false, "The listener ID is repeat")
            return false
        } else {
            listenerSet.insert(listener)
            return true
        }
        
    }

    func bindAndFire(ID: String, action: Listener<T>.Action) {
        if bind(ID, action: action) {
            action(value)
        }
    }
    
    func removeActionWithID(ID: String) -> Bool {
        
        for alistener in listenerSet {
            if alistener.name == ID {
                listenerSet.remove(alistener)
                return true
            }
        }
        
        return false
    }
    
    deinit {
        listenerSet.removeAll(keepCapacity: false)
    }
    
    var value: T {
        didSet {
            
            for aListener in listenerSet {
                aListener.action(value)
            }
        }
    }
    
    init(_ v: T) {
        value = v
    }
}

class Model {
   
    var name = "Emiaostein" {
        didSet {
            nameListener.value = name
        }
    }
    var title = 123 {
        didSet {
            titleListener.value = title
        }
    }
    
    var nameListener: Dynamic<String>!
    var titleListener: Dynamic<Int>!
    
    init() {
        nameListener = Dynamic(name)
        titleListener = Dynamic(title)
    }
}
