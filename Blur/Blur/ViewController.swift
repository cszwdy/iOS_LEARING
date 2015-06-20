//
//  ViewController.swift
//  Blur
//
//  Created by Emiaostein on 6/17/15.
//  Copyright © 2015 botai. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var largeImageView: UIImageView!
    @IBOutlet weak var contentView: UIView!
    @IBOutlet weak var imageView: UIImageView!
    @IBOutlet weak var visualEffectView: UIVisualEffectView!
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


    @IBAction func PanAction(sender: UIPanGestureRecognizer) {
        
        let transition = sender.translationInView(view)
        
        let progress = transition.x / 100.0
        contentView.center.x += transition.x
        visualEffectView.alpha -= progress
        largeImageView.center.x += transition.x * 1.5

        
        sender.setTranslation(CGPointZero, inView: view)
        
    }
}

