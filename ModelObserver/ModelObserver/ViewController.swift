//
//  ViewController.swift
//  ModelObserver
//
//  Created by Emiaostein on 6/9/15.
//  Copyright (c) 2015 BoTai Technology. All rights reserved.
//

import UIKit

class ViewController: UIViewController, UITextViewDelegate {

    @IBOutlet weak var blueTextView: UITextView!
    @IBOutlet weak var orangeTextView: UITextView!
    @IBOutlet weak var purpleTextView: UITextView!
    let model = Model()
    override func viewDidLoad() {
        super.viewDidLoad()
        
        NSNotificationCenter.defaultCenter().addObserver(self, selector: "textChagned:", name: UITextFieldTextDidBeginEditingNotification, object: nil)

        model.nameListener.bindAndFire("Purple", action: {[unowned self] name -> Void in
            
            self.purpleTextView.text = name
        })
    }
    
    func textViewDidChange(textView: UITextView) {
        
        model.name = textView.text
    }
    
    @IBAction func deBlueAction(sender: UIButton) {
        model.nameListener.removeActionWithID("Blue")
    }
    
    @IBAction func addBlueAction(sender: UIButton) {
        model.nameListener.bindAndFire("Blue", action: {[unowned self] name -> Void in
            
            self.blueTextView.text = name
            })
    }
    
    @IBAction func deleteOrangeAction(sender: UIButton) {
        model.nameListener.removeActionWithID("Orange")
    }
    
    @IBAction func addOrangeAction(sender: UIButton) {
        model.nameListener.bindAndFire("Orange", action: {[unowned self] name -> Void in
            
            self.orangeTextView.text = name
            })
    }
    
}

