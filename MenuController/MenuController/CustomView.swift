//
//  CustomView.swift
//  MenuController
//
//  Created by Emiaostein on 6/5/15.
//  Copyright (c) 2015 BoTai Technology. All rights reserved.
//

import UIKit

class CustomView: UIView {

    /*
    // Only override drawRect: if you perform custom drawing.
    // An empty implementation adversely affects performance during animation.
    override func drawRect(rect: CGRect) {
        // Drawing code
    }
    */
    
    override func canBecomeFirstResponder() -> Bool {
        
        return true
    }
    
    override func canPerformAction(action: Selector, withSender sender: AnyObject?) -> Bool {
        
        return (action == Selector("Edit:"))
    }
    
    func Edit(sender: UIMenuItem) {
        
        func attributes(view: UIView) {
            
        }
        
        println("CustomView Edit")
        NSNotificationCenter.defaultCenter().postNotificationName("ChangeView", object: self)
    }
}
