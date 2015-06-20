//
//  ViewController.swift
//  animation
//
//  Created by Emiaostein on 6/15/15.
//  Copyright (c) 2015 BoTai Technology. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var aView: CustomView!
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
    }
    
    

    @IBOutlet var tapAction: UITapGestureRecognizer!

    @IBAction func tapActions(sender: UITapGestureRecognizer) {
        
        aView.addUntitled1Animation()
    }
}

