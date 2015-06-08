//
//  ViewController.swift
//  ControlBar
//
//  Created by Emiaostein on 6/8/15.
//  Copyright (c) 2015 BoTai Technology. All rights reserved.
//

import UIKit

class ViewController: UIViewController, UIGestureRecognizerDelegate, EditToolsBarProtocol {
    
    var editToolsBar: EditToolsBar!
    var pannel: EditToolsPannel?
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        var barItems = [UIBarButtonItem]()
        for index in 0...9 {
            
            let image = UIImage(named: "\(index)")
            let barItem = UIBarButtonItem(image: image, style: .Plain, target: self, action: "buttonAction:")
            barItems.append(barItem)
        }
        
        editToolsBar = EditToolsBar(aframe: CGRect(x: 0, y: 568 - 50, width: 320, height: 50), aItems: barItems, aDelegate: self)
        
        view.addSubview(editToolsBar)
    }
    
    @IBAction func changeAction(sender: UIButton) {
        
        let needShow = !editToolsBar.isShowAccessoryView
        if needShow {
            editToolsBar.showAccessoryView()
        } else {
            editToolsBar.hiddenAccessoryView()
        }
    }
    @IBAction func tapAction(sender: UITapGestureRecognizer) {
        
        println("tap Action")
        if let aPannel = self.pannel {
            self.editToolsBar.hiddenAccessoryView()
            UIView.animateWithDuration(0.5, animations: { () -> Void in
                
                aPannel.transform = CGAffineTransformMakeTranslation(0, 0)
                self.editToolsBar.transform = CGAffineTransformMakeTranslation(0, 0)
            })
        }
    }
    
    func buttonAction(sender: UIButton) {
        
        println("button")
        
        if pannel == nil {
            pannel = EditToolsPannel(frame: CGRect(x: 0, y: 568, width: 320, height: 240))
            pannel!.backgroundColor = UIColor.lightGrayColor()
            view.addSubview(pannel!)
        }
        
        
        if let aPannel = self.pannel {
            UIView.animateWithDuration(0.3, animations: { () -> Void in
                aPannel.transform = CGAffineTransformMakeTranslation(0, -240)
                self.editToolsBar.transform = CGAffineTransformMakeTranslation(0, -240)
            })
        }
    }
    
    
    
    
    func gestureRecognizerShouldBegin(gestureRecognizer: UIGestureRecognizer) -> Bool {
        
        let location = gestureRecognizer.locationInView(editToolsBar)
        return !CGRectContainsPoint(editToolsBar.bounds, location)
    }
    
    func editToolsBarDidSelectedAccessoryView(editToolsBar: EditToolsBar) {
        
        if let aPannel = self.pannel {
            self.editToolsBar.hiddenAccessoryView()
            UIView.animateWithDuration(0.5, animations: { () -> Void in
                
                aPannel.transform = CGAffineTransformMakeTranslation(0, 0)
                self.editToolsBar.transform = CGAffineTransformMakeTranslation(0, 0)
            })
        }
    }
}

