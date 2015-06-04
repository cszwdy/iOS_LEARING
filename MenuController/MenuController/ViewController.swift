//
//  ViewController.swift
//  MenuController
//
//  Created by Emiaostein on 6/4/15.
//  Copyright (c) 2015 BoTai Technology. All rights reserved.
//

import UIKit

class ViewController: UIViewController {
    
let menu = UIMenuController.sharedMenuController()
    override func viewDidLoad() {
        super.viewDidLoad()

    }
    
    @IBAction func tapAction(sender: UITapGestureRecognizer) {
        
        view.becomeFirstResponder()
        
        let menuItems = [UIMenuItem(title: "Edit", action: "Edit:"), UIMenuItem(title: "Remove", action: "Remove:")]
        menu.menuItems = menuItems
        menu.setTargetRect(sender.view!.frame, inView: view)
        menu.setMenuVisible(true, animated: true)
        
    }
    
    override func canPerformAction(action: Selector, withSender sender: AnyObject?) -> Bool {
        
        return (action == Selector("Edit:"))
    }
    
    func Edit(sender: UIMenuItem) {
        
    }
    
    func Remove(sender: UIMenuItem) {
        
    }
    
    // http://stackoverflow.com/questions/3112925/uimenucontroller-not-showing-up
    
    override func canBecomeFirstResponder() -> Bool {
        
        return true
    }
    
}

