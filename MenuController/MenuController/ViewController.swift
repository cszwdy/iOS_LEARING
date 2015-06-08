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

        NSNotificationCenter.defaultCenter().addObserver(self, selector: "changeView:", name: "ChangeView", object: nil)
    }
    
    @IBAction func tapAction(sender: UITapGestureRecognizer) {
        
        sender.view!.becomeFirstResponder()
        
        let menuItems = [UIMenuItem(title: "Edit", action: "Edit:"), UIMenuItem(title: "Remove", action: "Remove:")]
        menu.menuItems = menuItems
        menu.setTargetRect(sender.view!.frame, inView: view)
        menu.setMenuVisible(true, animated: true)
    }
    
    func Remove(sender: UIMenuItem) {
        
    }
    
    func changeView(noti: NSNotification) {
        
        if let obj = noti.object as? CustomView {
            
            obj.bounds.size.width -= 100.0
        }
    }
}

