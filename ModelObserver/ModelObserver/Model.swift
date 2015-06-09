//
//  Model.swift
//  ModelObserver
//
//  Created by Emiaostein on 6/9/15.
//  Copyright (c) 2015 BoTai Technology. All rights reserved.
//

import UIKit

func ==(lhs: Listener, rhs: Listener) -> Bool {
    return lhs.name == rhs.name
}

struct Listener: Hashable {
    
    let name: String
    
    typealias Action = String -> Void
    let action: Action
    
    var hashValue: Int {
        return name.hashValue
    }
}

class Dynamic<T> {

    var listenerSet = Set<Listener>()
    
//    var listener: Listener?
//    
//    func bind(listener: Listener?) {
//        self.listener = listener
//    }
//    
//    func bindAndFire(listener: Listener?) {
//        self.listener = listener
//        if let listener = listener {
//            listener(value)
//        }
//    }
    
    var value: T {
        didSet {
            
            for aListener in listenerSet {
                
            }
        }
    }
    
    init(_ v: T) {
        value = v
    }
}

class Model: NSObject {
   
    var name = "Emiaostein"
    var title = 123

}
