//
//  ViewController.swift
//  LocalizableDemo
//
//  Created by Emiaostein on 6/12/15.
//  Copyright (c) 2015 BoTai Technology. All rights reserved.
//

import UIKit

class ViewController: UIViewController {

    @IBOutlet weak var label: UILabel!
    override func viewDidLoad() {
        super.viewDidLoad()
        // Do any additional setup after loading the view, typically from a nib.
        
        label.text = NSLocalizedString("GOOD",comment:"Good Morning")
    }

    override func didReceiveMemoryWarning() {
        super.didReceiveMemoryWarning()
        // Dispose of any resources that can be recreated.
    }


}

