//
//  ViewController.swift
//  blurView
//
//  Created by Emiaostein on 6/17/15.
//  Copyright (c) 2015 BoTai Technology. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var aView: UIView!
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }

    @IBAction func panAction(sender: UIPanGestureRecognizer) {
        
        let transition = sender.translationInView(view)
        let progress = transition.x / 100.0
        let aoView = aView.subviews[0] as! UIView
        let ablurView = aView.subviews[1] as! UIView
        aView.center.x += transition.x
//        aoView.alpha += progress
        ablurView.alpha -= progress
//        aView.alpha += progress
        
        sender.setTranslation(CGPointZero, inView: view)
    }

}

